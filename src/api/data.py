# data.py

users = [
    {"userID": 1, "name": "Alice", "email": "alice@example.com", "password": "secure123"},
    {"userID": 2, "name": "Bob", "email": "bob@example.com", "password": "mypassword"},
    {"userID": 3, "name": "Charlie", "email": "charlie@example.com", "password": "charliepass"},
    {"userID": 4, "name": "David", "email": "david@example.com", "password": "davidpwd"},
    {"userID": 5, "name": "Eve", "email": "eve@example.com", "password": "evesecret"}
]

groups = [
    {"groupID": 1, "group_name": "Travel Buddies", "created_at": "2024-01-01T12:00:00", "total_Amount": 5000},
    {"groupID": 2, "group_name": "Roommates", "created_at": "2024-02-10T10:30:00", "total_Amount": 1200},
    {"groupID": 3, "group_name": "Gym Squad", "created_at": "2024-03-15T09:15:00", "total_Amount": 800},
    {"groupID": 4, "group_name": "Gaming Friends", "created_at": "2024-04-20T14:45:00", "total_Amount": 300},
    {"groupID": 5, "group_name": "Startup Team", "created_at": "2024-05-05T17:20:00", "total_Amount": 10000}
]

group_to_user = [
    {"id": 1, "userID": 1, "groupId": 1, "created_at": "2024-01-01T12:10:00"},
    {"id": 2, "userID": 2, "groupId": 1, "created_at": "2024-01-02T13:15:00"},
    {"id": 3, "userID": 3, "groupId": 2, "created_at": "2024-02-11T14:30:00"},
    {"id": 4, "userID": 4, "groupId": 3, "created_at": "2024-03-16T08:45:00"},
    {"id": 5, "userID": 5, "groupId": 5, "created_at": "2024-05-06T10:00:00"}
]

group_payments = [
    {"id": 1, "receiverID": 1, "payerID": 2, "groupID": 1, "amount": 200, "payed_at": "2024-01-05T12:30:00"},
    {"id": 2, "receiverID": 3, "payerID": 4, "groupID": 2, "amount": 50, "payed_at": "2024-02-15T14:10:00"},
    {"id": 3, "receiverID": 5, "payerID": 1, "groupID": 3, "amount": 75, "payed_at": "2024-03-20T16:45:00"},
    {"id": 4, "receiverID": 2, "payerID": 3, "groupID": 4, "amount": 30, "payed_at": "2024-04-25T18:00:00"},
    {"id": 5, "receiverID": 4, "payerID": 5, "groupID": 5, "amount": 1000, "payed_at": "2024-05-10T20:15:00"}
]

payments = [
    {"id": 6, "debtID": 1, "payerID": 2, "receiverID": 1, "amount": 200, "payed_at": "2024-01-05T12:30:00"},
    {"id": 2, "debtID": 2, "payerID": 3, "receiverID": 4, "amount": 50, "payed_at": "2024-02-15T14:10:00"},
    {"id": 3, "debtID": 3, "payerID": 5, "receiverID": 1, "amount": 75, "payed_at": "2024-03-20T16:45:00"},
    {"id": 4, "debtID": 4, "payerID": 2, "receiverID": 3, "amount": 30, "payed_at": "2024-04-25T18:00:00"},
    {"id": 5, "debtID": 5, "payerID": 4, "receiverID": 5, "amount": 1000, "payed_at": "2024-05-10T20:15:00"}
]

expenses = [
    {"expenseID": 1, "groupID": 1, "payerId": 1, "shared_between": 3, "amount": 150, "description": "Dinner", "created_at" : "2024-02-15T14:00:00"},
    {"expenseID": 2, "groupID": 2, "payerId": 2, "shared_between": 2, "amount": 80, "description": "Groceries", "created_at" : "2024-02-15T14:00:00"},
    {"expenseID": 3, "groupID": 3, "payerId": 3, "shared_between": 4, "amount": 200, "description": "Gym membership", "created_at" : "2024-02-15T14:00:00"},
    {"expenseID": 4, "groupID": 4, "payerId": 4, "shared_between": 5, "amount": 300, "description": "Game console", "created_at" : "2024-02-15T14:00:00"},
    {"expenseID": 5, "groupID": 5, "payerId": 5, "shared_between": 3, "amount": 500, "description": "Startup materials", "created_at" : "2024-02-15T14:00:00"}
]

debts = [
    {"debtID": 1, "expensesID": 1, "debtorID": 2, "amount_to_pay": 50, "is_paid": False, "payed_at": None},
    {"debtID": 2, "expensesID": 2, "debtorID": 3, "amount_to_pay": 40, "is_paid": True, "payed_at": "2024-05-10T20:15:00"},
    {"debtID": 3, "expensesID": 3, "debtorID": 4, "amount_to_pay": 50, "is_paid": False, "payed_at":None },
    {"debtID": 4, "expensesID": 4, "debtorID": 5, "amount_to_pay": 60, "is_paid": True, "payed_at": "2024-05-10T20:15:00"},
    {"debtID": 5, "expensesID": 5, "debtorID": 1, "amount_to_pay": 170, "is_paid": False, "payed_at": None}
]

messages = [
    {"id": 1, "from_userid": 1, "message": "Hello, team!", "sent_at": "2024-01-10T09:00:00"},
    {"id": 2, "from_userid": 2, "message": "Let's split the bill.", "sent_at": "2024-02-15T14:00:00"},
    {"id": 3, "from_userid": 3, "message": "Meeting at 5 PM?", "sent_at": "2024-03-20T16:30:00"},
    {"id": 4, "from_userid": 4, "message": "Don't forget to contribute.", "sent_at": "2024-04-25T18:45:00"},
    {"id": 5, "from_userid": 5, "message": "See you tomorrow!", "sent_at": "2024-05-30T20:15:00"}
]

objectives = [
    {"id": 1, "groupID": 1, "name": "Trip to Japan", "target_amount": 5000,"created_at": "2024-02-15T14:00:00", "is_completed": False},
    {"id": 2, "groupID": 2, "name": "New Apartment", "target_amount": 10000,"created_at": "2024-02-15T14:00:00", "is_completed": False},
    {"id": 3, "groupID": 3, "name": "Fitness Challenge", "target_amount": 800,"created_at": "2024-02-15T14:00:00", "is_completed": True},
    {"id": 4, "groupID": 4, "name": "Gaming Setup", "target_amount": 2000,"created_at": "2024-02-15T14:00:00", "is_completed": False},
    {"id": 5, "groupID": 5, "name": "Startup Fund", "target_amount": 15000,"created_at": "2024-02-15T14:00:00", "is_completed": False}
]

objectives_contributions = [
    {"id": 1, "objectiveID": 1, "userID": 1, "amount_contributed": 500, "contributed_at": "2024-01-10T09:00:00"},
    {"id": 2, "objectiveID": 1, "userID": 2, "amount_contributed": 1000, "contributed_at": "2024-01-15T10:30:00"},
    {"id": 3, "objectiveID": 2, "userID": 3, "amount_contributed": 2000, "contributed_at": "2024-02-01T14:20:00"},
    {"id": 4, "objectiveID": 3, "userID": 4, "amount_contributed": 400, "contributed_at": "2024-03-05T18:45:00"},
    {"id": 5, "objectiveID": 4, "userID": 5, "amount_contributed": 150, "contributed_at": "2024-04-10T12:10:00"}
]