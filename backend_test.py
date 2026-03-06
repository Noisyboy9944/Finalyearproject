import requests
import sys
from datetime import datetime
import json

class UniLearnHubAPITester:
    def __init__(self, base_url="https://learn-scroll-hub.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.program_id = None
        self.subject_id = None
        self.unit_id = None
        self.video_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, auth_required=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if auth_required and self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test backend health endpoint"""
        success, response = self.run_test(
            "Backend Health Check",
            "GET", 
            "",
            200
        )
        return success

    def test_seed_data(self):
        """Test seeding the database"""
        success, response = self.run_test(
            "Seed Database",
            "POST",
            "seed",
            200
        )
        return success

    def test_register(self, email, password, full_name):
        """Test user registration"""
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data={
                "email": email,
                "password": password,
                "full_name": full_name
            }
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"   Token received: {self.token[:20]}...")
            return True
        return False

    def test_login(self, email, password):
        """Test user login"""
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data={
                "email": email,
                "password": password
            }
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"   Token received: {self.token[:20]}...")
            return True
        return False

    def test_get_programs(self):
        """Test getting all programs"""
        success, response = self.run_test(
            "Get Programs",
            "GET",
            "programs",
            200,
            auth_required=True
        )
        if success and isinstance(response, list) and len(response) > 0:
            self.program_id = response[0].get('id')
            print(f"   Found {len(response)} programs, first ID: {self.program_id}")
            return True
        return False

    def test_get_program_subjects(self):
        """Test getting subjects for a program"""
        if not self.program_id:
            print("❌ No program ID available")
            return False
            
        success, response = self.run_test(
            "Get Program Subjects",
            "GET",
            f"programs/{self.program_id}/subjects",
            200,
            auth_required=True
        )
        if success and isinstance(response, list) and len(response) > 0:
            self.subject_id = response[0].get('id')
            print(f"   Found {len(response)} subjects, first ID: {self.subject_id}")
            return True
        return False

    def test_get_subject_units(self):
        """Test getting units for a subject"""
        if not self.subject_id:
            print("❌ No subject ID available")
            return False
            
        success, response = self.run_test(
            "Get Subject Units",
            "GET",
            f"subjects/{self.subject_id}/units",
            200,
            auth_required=True
        )
        if success and isinstance(response, list) and len(response) > 0:
            self.unit_id = response[0].get('id')
            print(f"   Found {len(response)} units, first ID: {self.unit_id}")
            return True
        return False

    def test_get_unit_videos(self):
        """Test getting videos for a unit"""
        if not self.unit_id:
            print("❌ No unit ID available")
            return False
            
        success, response = self.run_test(
            "Get Unit Videos",
            "GET",
            f"units/{self.unit_id}/videos",
            200,
            auth_required=True
        )
        if success and isinstance(response, list) and len(response) > 0:
            self.video_id = response[0].get('id')
            print(f"   Found {len(response)} videos, first ID: {self.video_id}")
            return True
        return False

def main():
    print("🚀 Starting UniLearnHub API Tests")
    print("=" * 50)
    
    # Setup
    tester = UniLearnHubAPITester()
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    test_email = f"test_user_{timestamp}@example.com"
    test_password = "TestPass123!"
    test_name = f"Test User {timestamp}"

    # Test sequence
    tests = [
        ("Backend Health Check", lambda: tester.test_health_check()),
        ("Seed Database", lambda: tester.test_seed_data()),
        ("User Registration", lambda: tester.test_register(test_email, test_password, test_name)),
        ("User Login", lambda: tester.test_login(test_email, test_password)),
        ("Get Programs", lambda: tester.test_get_programs()),
        ("Get Program Subjects", lambda: tester.test_get_program_subjects()),
        ("Get Subject Units", lambda: tester.test_get_subject_units()),
        ("Get Unit Videos", lambda: tester.test_get_unit_videos()),
    ]

    failed_tests = []
    
    for test_name, test_func in tests:
        try:
            if not test_func():
                failed_tests.append(test_name)
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {str(e)}")
            failed_tests.append(test_name)

    # Print final results
    print("\n" + "=" * 50)
    print("📊 FINAL TEST RESULTS")
    print("=" * 50)
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%" if tester.tests_run > 0 else "No tests run")
    
    if failed_tests:
        print(f"\n❌ Failed tests: {', '.join(failed_tests)}")
    else:
        print("\n✅ All tests passed!")

    # Return appropriate exit code
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())