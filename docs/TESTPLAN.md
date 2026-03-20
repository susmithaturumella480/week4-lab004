# COBOL Account Management System - Test Plan

## Overview
This test plan covers all business logic and functionality of the COBOL Account Management System. It is designed to validate the system's core operations: viewing balance, crediting accounts, debiting accounts, and user input validation. This plan will serve as the foundation for creating unit and integration tests in the Node.js application.

---

## Test Cases

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | Verify initial account balance | System started for the first time | 1. Launch the application<br/>2. Select option 1 (View Balance) | System displays current balance of 1000.00 | | | Initial balance is hardcoded in data.cob as 1000.00 |
| TC-002 | View current balance (no prior transactions) | Application running, no transactions performed | 1. Display menu<br/>2. User selects option 1<br/>3. System calls Operations with 'TOTAL ' operation<br/>4. Operations calls DataProgram with 'READ' | Current balance of 1000.00 is displayed to user | | | Tests READ operation from DataProgram |
| TC-003 | Credit account with valid amount | Application running with balance at 1000.00 | 1. Display menu<br/>2. User selects option 2 (Credit Account)<br/>3. System prompts for credit amount<br/>4. User enters 500.00<br/>5. System calls Operations with 'CREDIT' operation<br/>6. Operations calls DataProgram with 'READ' to get current balance<br/>7. Operations adds amount to balance<br/>8. Operations calls DataProgram with 'WRITE' to save new balance | System displays new balance of 1500.00 | | | Tests credit operation and WRITE functionality |
| TC-004 | Credit account with small amount | Application running with balance at 1000.00 | 1. Select option 2 (Credit Account)<br/>2. Enter credit amount 1.00 | System displays new balance of 1001.00 | | | Tests boundary condition with fractional amounts |
| TC-005 | Credit account with large amount | Application running with balance at 1000.00 | 1. Select option 2 (Credit Account)<br/>2. Enter credit amount 9999.99 | System displays new balance of 10999.99 | | | Tests handling of large amounts |
| TC-006 | Multiple sequential credits | Application running with balance at 1000.00 | 1. Select option 2, enter 100.00<br/>2. Confirm new balance is 1100.00<br/>3. Select option 2 again, enter 200.00<br/>4. Confirm new balance is 1300.00 | First credit: 1100.00, Second credit: 1300.00 | | | Tests data persistence and compound operations |
| TC-007 | Debit account with sufficient funds | Application running with balance at 1000.00 | 1. Display menu<br/>2. User selects option 3 (Debit Account)<br/>3. System prompts for debit amount<br/>4. User enters 250.00<br/>5. System calls Operations with 'DEBIT ' operation<br/>6. Operations reads current balance (1000.00)<br/>7. Operations checks if balance >= amount<br/>8. Amount is subtracted and balance is written back | System displays new balance of 750.00 | | | Tests debit operation with sufficient funds |
| TC-008 | Debit account with exact balance amount | Application running with balance at 1000.00 | 1. Select option 3 (Debit Account)<br/>2. Enter debit amount 1000.00 | System displays new balance of 0.00 | | | Tests boundary condition: debit exactly equals balance |
| TC-009 | Debit account with insufficient funds | Application running with balance at 500.00 | 1. Select option 3 (Debit Account)<br/>2. System prompts for debit amount<br/>3. User enters 600.00<br/>4. System calls Operations with 'DEBIT '<br/>5. Operations reads current balance (500.00)<br/>6. Operations checks if balance >= amount (500.00 >= 600.00 is false)<br/>7. Operations enters ELSE block | System displays message "Insufficient funds for this debit." and balance remains 500.00 | | | Tests negative case: debit amount exceeds balance |
| TC-010 | Debit attempt with insufficient funds does not modify balance | Application running with balance at 100.00 | 1. Select option 3 (Debit Account)<br/>2. Enter debit amount 150.00<br/>3. System denies operation<br/>4. Select option 1 to view balance | Balance remains unchanged at 100.00 | | | Tests that failed debit does not corrupt data |
| TC-011 | Multiple sequential debits | Application running with balance at 1000.00 | 1. Select option 3, enter 100.00, confirm new balance is 900.00<br/>2. Select option 3, enter 200.00, confirm new balance is 700.00<br/>3. Select option 3, enter 300.00, confirm new balance is 400.00 | Debits applied sequentially: 900.00 → 700.00 → 400.00 | | | Tests compound debit operations and data persistence |
| TC-012 | Mixed credit and debit operations | Application running with balance at 1000.00 | 1. Select option 2, credit 500.00 (balance now 1500.00)<br/>2. Select option 3, debit 300.00 (balance now 1200.00)<br/>3. Select option 2, credit 200.00 (balance now 1400.00)<br/>4. Select option 1 to view balance | Final balance should be 1400.00 | | | Tests interleaved operations and complex state management |
| TC-013 | Menu option 1 - View Balance display | Application running | 1. Display main menu<br/>2. User selects option 1 | Option 1 displays "View Balance" in menu<br/>Menu is displayed with options 1-4 | | | Tests menu display functionality |
| TC-014 | Menu option 2 - Credit Account display | Application running | 1. Display main menu<br/>2. User selects option 2 | Option 2 displays "Credit Account" in menu<br/>System prompts for credit amount | | | Tests menu display and credit prompt |
| TC-015 | Menu option 3 - Debit Account display | Application running | 1. Display main menu<br/>2. User selects option 3 | Option 3 displays "Debit Account" in menu<br/>System prompts for debit amount | | | Tests menu display and debit prompt |
| TC-016 | Menu option 4 - Exit | Application running | 1. Display main menu<br/>2. User selects option 4 | System displays "Exiting the program. Goodbye!"<br/>Program terminates | | | Tests exit functionality |
| TC-017 | Invalid menu choice - value 0 | Application running and menu displayed | 1. User selects option 0 | System displays "Invalid choice, please select 1-4."<br/>Menu is redisplayed | | | Tests input validation for choice below range |
| TC-018 | Invalid menu choice - value 5 | Application running and menu displayed | 1. User selects option 5 | System displays "Invalid choice, please select 1-4."<br/>Menu is redisplayed | | | Tests input validation for choice above range |
| TC-019 | Invalid menu choice - non-numeric input | Application running and menu displayed | 1. User enters 'A' or other non-numeric character | System displays "Invalid choice, please select 1-4."<br/>Menu is redisplayed | | | Tests input validation for non-numeric entry |
| TC-020 | Account balance decimal precision | Application running | 1. Credit 0.50, then view balance | Balance displays with two decimal places (e.g., 1000.50) | | | Tests that decimal amounts are handled correctly |
| TC-021 | Continuous operation loop | Application running | 1. Perform operation 1 (view balance)<br/>2. Menu redisplays<br/>3. Perform operation 2 (credit)<br/>4. Menu redisplays<br/>5. Perform operation 3 (debit)<br/>6. Menu redisplays | After each operation (except exit), main menu redisplays and system accepts new input | | | Tests PERFORM UNTIL loop logic |
| TC-022 | Program exit terminates correctly | Application running | 1. Select option 4 (Exit) | Application displays goodbye message and exits cleanly without errors | | | Tests clean program termination |
| TC-023 | Debit with amount greater than maximum field value | Application running with balance at 1000.00 | 1. Select option 3 (Debit Account)<br/>2. Enter amount 9999999 (exceeds field limit) | System either truncates or handles overflow appropriately | | | Tests field overflow handling (AMOUNT field max: 9(6)V99) |
| TC-024 | Credit with zero amount | Application running with balance at 1000.00 | 1. Select option 2 (Credit Account)<br/>2. Enter credit amount 0.00 | System processes credit with 0 amount (accepted by COBOL but test can verify)<br/>Balance remains 1000.00 | | | Tests boundary condition: zero credit |
| TC-025 | Debit with zero amount | Application running with balance at 1000.00 | 1. Select option 3 (Debit Account)<br/>2. Enter debit amount 0.00 | System processes debit with 0 amount<br/>Balance remains 1000.00 | | | Tests boundary condition: zero debit |
| TC-026 | Balance reads correctly after system state change | Application running | 1. Perform multiple operations to change balance<br/>2. View balance<br/>3. Exit and restart application | On restart, verify if previous balance is retained or reset to 1000.00 | | | Tests data persistence across application restarts (important for production readiness) |

---

## Test Coverage Summary

### Business Logic Components Covered

| Component | Test Cases |
|---|---|
| View Balance (TOTAL operation) | TC-001, TC-002 |
| Credit Account (CREDIT operation) | TC-003, TC-004, TC-005, TC-006, TC-024 |
| Debit Account (DEBIT operation) | TC-007, TC-008, TC-009, TC-010, TC-011, TC-025 |
| Insufficient Funds Check | TC-009, TC-010 |
| Mixed Operations | TC-012 |
| Menu System & Validation | TC-013, TC-014, TC-015, TC-016, TC-017, TC-018, TC-019 |
| Data Persistence | TC-006, TC-011, TC-012, TC-026 |
| Decimal Handling | TC-004, TC-020, TC-024, TC-025 |
| Edge Cases & Boundary Conditions | TC-008, TC-023 |
| Program Flow & Loops | TC-021, TC-022 |

---

## Key Business Rules Validated

1. **Initial Balance**: System starts with balance of 1000.00 ✓ (TC-001)
2. **Credit Operation**: User-entered amount is added to current balance ✓ (TC-003, TC-006)
3. **Debit Operation**: User-entered amount is subtracted if funds are sufficient ✓ (TC-007, TC-011)
4. **Insufficient Funds Protection**: Debit is rejected if balance < amount ✓ (TC-009, TC-010)
5. **Data Persistence**: Balance persists across sequential operations ✓ (TC-006, TC-011, TC-012)
6. **Menu Loop**: Application continues until user selects Exit ✓ (TC-021)
7. **Input Validation**: Invalid menu choices are rejected ✓ (TC-017, TC-018, TC-019)
8. **Decimal Precision**: Amounts support two decimal places ✓ (TC-020)

---

## Notes for Node.js Migration

- When converting to Node.js, ensure the same business logic is replicated exactly as tested here.
- The data persistence test (TC-026) should be considered for the Node.js version—decide if this should use in-memory, file, or database storage.
- Input validation can be enhanced in Node.js with more granular error handling.
- Consider adding request/response logging for better auditability.
- Unit tests should map 1:1 to these test cases for traceability.
- Integration tests should verify the full flow (Menu → Operation → DataStore) as shown in the sequence diagram.
