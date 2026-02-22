from fastapi import FastAPI, APIRouter, HTTPException, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Auth Config
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 300

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI()
api_router = APIRouter(prefix="/api")

# --- Models ---

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    password_hash: str
    full_name: str
    role: str = "student" # student, admin
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_name: str

class Program(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    image_url: Optional[str] = None

class Subject(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    program_id: str
    title: str
    description: str
    icon: Optional[str] = "Book"

class Unit(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    subject_id: str
    title: str
    order: int

class Video(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    unit_id: str
    title: str
    url: str # YouTube URL
    duration: str
    instructor: str
    order: int

# --- Auth Helpers ---

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Routes ---

@api_router.get("/")
async def root():
    return {"message": "UniLearnHub API Running"}

# Auth
@api_router.post("/auth/register", response_model=Token)
async def register(user: UserCreate):
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_obj = User(
        email=user.email,
        password_hash=get_password_hash(user.password),
        full_name=user.full_name
    )
    
    doc = user_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.users.insert_one(doc)
    
    access_token = create_access_token(data={"sub": user.email, "role": "student"})
    return {"access_token": access_token, "token_type": "bearer", "user_name": user.full_name}

@api_router.post("/auth/login", response_model=Token)
async def login(user: UserLogin):
    db_user = await db.users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user['password_hash']):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": db_user['email'], "role": db_user['role']})
    return {"access_token": access_token, "token_type": "bearer", "user_name": db_user['full_name']}

# Programs
@api_router.get("/programs", response_model=List[Program])
async def get_programs():
    programs = await db.programs.find({}, {"_id": 0}).to_list(100)
    return programs

@api_router.get("/programs/{program_id}", response_model=Program)
async def get_program(program_id: str):
    program = await db.programs.find_one({"id": program_id}, {"_id": 0})
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    return program

# Subjects
@api_router.get("/programs/{program_id}/subjects", response_model=List[Subject])
async def get_subjects(program_id: str):
    subjects = await db.subjects.find({"program_id": program_id}, {"_id": 0}).to_list(100)
    return subjects

@api_router.get("/subjects/{subject_id}", response_model=Subject)
async def get_subject(subject_id: str):
    subject = await db.subjects.find_one({"id": subject_id}, {"_id": 0})
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject

# Units
@api_router.get("/subjects/{subject_id}/units", response_model=List[Unit])
async def get_units(subject_id: str):
    units = await db.units.find({"subject_id": subject_id}, {"_id": 0}).sort("order", 1).to_list(100)
    return units

@api_router.get("/units/{unit_id}", response_model=Unit)
async def get_unit(unit_id: str):
    unit = await db.units.find_one({"id": unit_id}, {"_id": 0})
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    return unit

# Videos
@api_router.get("/units/{unit_id}/videos", response_model=List[Video])
async def get_videos(unit_id: str):
    videos = await db.videos.find({"unit_id": unit_id}, {"_id": 0}).sort("order", 1).to_list(100)
    return videos

@api_router.get("/videos/{video_id}", response_model=Video)
async def get_video(video_id: str):
    video = await db.videos.find_one({"id": video_id}, {"_id": 0})
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return video

# Seeding Endpoint (For convenience)
@api_router.post("/seed")
async def seed_data():
    # Only seed if empty
    if await db.programs.count_documents({}) > 0:
        return {"message": "Database already seeded"}

    # 1. Create Program
    bca = Program(
        title="Bachelor of Computer Applications (BCA)",
        description="A 3-year undergraduate course designed to provide students with a strong foundation in computer applications and software development.",
        image_url="https://images.unsplash.com/photo-1517694712202-14dd9538aa97"
    )
    await db.programs.insert_one(bca.model_dump())

    # 2. Create Subjects
    subjects_data = [
        {"title": "Mobile App Development", "desc": "Learn to build Android & iOS apps.", "icon": "DeviceMobile"},
        {"title": "Web Technologies", "desc": "Master HTML, CSS, JS, and React.", "icon": "Globe"},
        {"title": "Database Systems", "desc": "SQL, NoSQL, and Data Modeling.", "icon": "Database"},
        {"title": "Machine Learning", "desc": "Intro to AI and ML algorithms.", "icon": "Brain"}
    ]
    
    created_subjects = []
    for s in subjects_data:
        subj = Subject(program_id=bca.id, title=s['title'], description=s['desc'], icon=s['icon'])
        await db.subjects.insert_one(subj.model_dump())
        created_subjects.append(subj)

    # 3. Create Units & Videos for Mobile App Dev
    mobile_subj = created_subjects[0]
    units_data = [
        "Unit 1: Introduction to Mobile Computing",
        "Unit 2: UI Design in Flutter",
        "Unit 3: State Management",
        "Unit 4: API Integration"
    ]

    for i, u_title in enumerate(units_data):
        unit = Unit(subject_id=mobile_subj.id, title=u_title, order=i+1)
        await db.units.insert_one(unit.model_dump())
        
        # Add sample videos
        videos_data = [
            {"title": f"Lecture {i+1}.1: Basics of {u_title}", "url": "https://www.youtube.com/watch?v=fq4N0hgOWzU", "duration": "45:00"},
            {"title": f"Lecture {i+1}.2: Advanced Concepts", "url": "https://www.youtube.com/watch?v=x0uinJvhNxI", "duration": "50:00"}
        ]
        
        for j, v in enumerate(videos_data):
            video = Video(
                unit_id=unit.id,
                title=v['title'],
                url=v['url'],
                duration=v['duration'],
                instructor="Dr. Sarah Johnson",
                order=j+1
            )
            await db.videos.insert_one(video.model_dump())

    return {"message": "Database seeded successfully!"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
