## System Release Notes

This release introduces several improvements to the device management system, including:

**Watcher Service**

* The Watcher service now utilizes the Kopf Kubernetes Operator framework to listen for pod events.
* The service can detect pod events like added, updated, and deleted events.
* It builds event objects with detailed pod information and sends notifications to the Kafka Bus Service.

**Device Batch Operations**

* The system now implements a batch approach for device operations like mount, unmount, and retry.
* It uses Spring Batch to manage these operations, processing records in batches.
* The system handles the following device states:
    * **CONNECTING-CONNECTED:** Marks a device as connected during the connection process.
    * **CONNECTING-NONE:** Marks a device as disconnected when the connection process fails.
    * **NONE-CONNECTING:** Triggers a retry/remount operation when a device is disconnected.

**Group Mapping Configuration**

* The system allows for device group mapping configurations.
* This configuration determines which devices will be mounted on which groups based on specific criteria like vendor, model, etc.

**Device Management Enhancement**

* The system handles device requests, including Mount, Unmount, and Update requests.
* It creates and manages MountRequest objects and inserts them into a dedicated database.
* The system also manages the In-Progress Group queue, processing requests in batches for each group.
* It fetches the latest data for each group and submits mount/remount requests as needed.

**Improved Error Handling**

* The system now handles cases where invalid Management Entities (ME) are passed.
* It ensures that only valid MEs are used in the system, preventing errors.

**Overall Enhancements**

* The system now includes improved documentation and release notes.
* This release addresses several performance optimizations and bug fixes.

**Known Issues**

* A known issue related to the handling of missing Management Entities during the request process has been identified and is currently being addressed. 

This release provides significant improvements to the device management system, offering enhanced functionality, improved error handling, and better overall performance.
