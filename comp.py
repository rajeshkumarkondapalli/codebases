import requests
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def check_all_devices_statuses(correlation_id_dict, namespace, max_attempts=5):
    attempts = 0
    total = len(correlation_id_dict)
    tmp_correlation_id_dict = correlation_id_dict.copy()
    successful = []
    failed = []

    logging.info(f'Checking device statuses for {total} devices...')

    while len(successful) < total and attempts < max_attempts and tmp_correlation_id_dict:  # Added check for empty dictionary
        attempts += 1
        logging.info(f'Attempt {attempts}: {len(successful)}/{total} devices successful.')
        time.sleep(1)

        # Iterate through the remaining devices in the temporary dictionary
        devices_to_remove = []  # Store devices to remove after iteration to avoid dictionary modification during iteration
        for device_name, correlation_id in tmp_correlation_id_dict.items():
            status_api_endpoint = f'httpurl/{device_name}'
            logging.debug(f'Checking device: {device_name} - API endpoint: {status_api_endpoint}')

            try:
                response = requests.get(status_api_endpoint, params={'briefOutput': 'true'}, auth=("admin", "admin"))
                response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
                logging.debug(f'Response content: {response.content}')

                if response.status_code == 200:
                    successful.append(device_name)
                    logging.info(f'Device {device_name} successful.')
                    devices_to_remove.append(device_name)  # Mark for removal
                else:
                    failed.append(device_name)
                    logging.warning(f'Device {device_name} failed with status code: {response.status_code}')
                    devices_to_remove.append(device_name)  # Mark for removal

            except requests.exceptions.RequestException as e:
                failed.append(device_name)
                logging.error(f'Error checking device {device_name}: {e}')
                devices_to_remove.append(device_name)  # Mark for removal

        # Remove processed devices from the temporary dictionary
        for device_name in devices_to_remove:
            tmp_correlation_id_dict.pop(device_name, None)

    logging.info(f'Finished: {len(successful)}/{total} devices successful, {len(failed)} devices failed.')






from bs4 import BeautifulSoup
import difflib

def extract_div_content(html_file, class_name):
    """Extracts the content of all <div> elements with a specific class name."""
    with open(html_file, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')
        return [div.get_text(strip=True) for div in soup.find_all('div', class_=class_name)]

def compare_divs(content1, content2):
    """Compares two lists of div contents and highlights differences."""
    diff = difflib.unified_diff(
        content1,
        content2,
        lineterm='',
        fromfile='File1',
        tofile='File2'
    )
    return '\n'.join(diff)

# Paths to HTML files
file1 = 'file1.html'
file2 = 'file2.html'

# Class name to target
target_class = 'your-target-class'

# Extract div contents
divs_file1 = extract_div_content(file1, target_class)
divs_file2 = extract_div_content(file2, target_class)

# Compare div contents
differences = compare_divs(divs_file1, divs_file2)

# Output differences
if differences:
    print("Differences found:")
    print(differences)
else:
    print("No differences found.")
