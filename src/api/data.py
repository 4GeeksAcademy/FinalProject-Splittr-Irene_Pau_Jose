# data.py

users = [
    {"user_id": 1, "name": "Alice", "email": "alice@example.com", "password": "secure123"},
    {"user_id": 2, "name": "Bob", "email": "bob@example.com", "password": "mypassword"},
    {"user_id": 3, "name": "Charlie", "email": "charlie@example.com", "password": "charliepass"},
    {"user_id": 4, "name": "David", "email": "david@example.com", "password": "davidpwd"},
    {"user_id": 5, "name": "Eve", "email": "eve@example.com", "password": "evesecret"}
]

groups = [
    {"group_id": 1, "group_name": "Travel Buddies", "created_at": "2024-01-01T12:00:00", "total_amount": 5000},
    {"group_id": 2, "group_name": "Roommates", "created_at": "2024-02-10T10:30:00", "total_amount": 1200},
    {"group_id": 3, "group_name": "Gym Squad", "created_at": "2024-03-15T09:15:00", "total_amount": 800},
    {"group_id": 4, "group_name": "Gaming Friends", "created_at": "2024-04-20T14:45:00", "total_amount": 300},
    {"group_id": 5, "group_name": "Startup Team", "created_at": "2024-05-05T17:20:00", "total_amount": 10000}
]

group_to_user = [
    {"id": 1, "user_id": 1, "group_id": 1, "created_at": "2024-01-01T12:10:00"},
    {"id": 2, "user_id": 2, "group_id": 1, "created_at": "2024-01-02T13:15:00"},
    {"id": 3, "user_id": 3, "group_id": 2, "created_at": "2024-02-11T14:30:00"},
    {"id": 4, "user_id": 4, "group_id": 3, "created_at": "2024-03-16T08:45:00"},
    {"id": 5, "user_id": 5, "group_id": 5, "created_at": "2024-05-06T10:00:00"}
]

group_payments = [
    {"id": 1, "receiver_id": 1, "payer_id": 2, "group_id": 1, "amount": 200, "payed_at": "2024-01-05T12:30:00"},
    {"id": 2, "receiver_id": 3, "payer_id": 4, "group_id": 2, "amount": 50, "payed_at": "2024-02-15T14:10:00"},
    {"id": 3, "receiver_id": 5, "payer_id": 1, "group_id": 3, "amount": 75, "payed_at": "2024-03-20T16:45:00"},
    {"id": 4, "receiver_id": 2, "payer_id": 3, "group_id": 4, "amount": 30, "payed_at": "2024-04-25T18:00:00"},
    {"id": 5, "receiver_id": 4, "payer_id": 5, "group_id": 5, "amount": 1000, "payed_at": "2024-05-10T20:15:00"}
]

group_debts = [
    {"id": 1, "debtor_id": 2, "creditor_id": 1, "group_id": 1, "amount": 50, "payed_at": None, "is_paid": False},
    {"id": 2, "debtor_id": 3, "creditor_id": 2, "group_id": 2, "amount": 40, "payed_at": "2024-05-10T20:15:00", "is_paid": True},
    {"id": 3, "debtor_id": 4, "creditor_id": 3, "group_id": 3, "amount": 50, "payed_at": None, "is_paid": False},
    {"id": 4, "debtor_id": 5, "creditor_id": 4, "group_id": 4, "amount": 60, "payed_at": "2024-05-10T20:15:00", "is_paid": True},
    {"id": 5, "debtor_id": 1, "creditor_id": 5, "group_id": 5, "amount": 170, "payed_at": None, "is_paid": False}
]


payments = [
    {"id": 6, "debt_id": 1, "payer_id": 2, "receiver_id": 1, "amount": 200, "payed_at": "2024-01-05T12:30:00"},
    {"id": 2, "debt_id": 2, "payer_id": 3, "receiver_id": 4, "amount": 50, "payed_at": "2024-02-15T14:10:00"},
    {"id": 3, "debt_id": 3, "payer_id": 5, "receiver_id": 1, "amount": 75, "payed_at": "2024-03-20T16:45:00"},
    {"id": 4, "debt_id": 4, "payer_id": 2, "receiver_id": 3, "amount": 30, "payed_at": "2024-04-25T18:00:00"},
    {"id": 5, "debt_id": 5, "payer_id": 4, "receiver_id": 5, "amount": 1000, "payed_at": "2024-05-10T20:15:00"}
]

expenses = [
    {"expense_id": 1, "group_id": 1, "payer_id": 1, "shared_between": 3, "amount": 150, "description": "Dinner", "created_at" : "2024-02-15T14:00:00"},
    {"expense_id": 2, "group_id": 2, "payer_id": 2, "shared_between": 2, "amount": 80, "description": "Groceries", "created_at" : "2024-02-15T14:00:00"},
    {"expense_id": 3, "group_id": 3, "payer_id": 3, "shared_between": 4, "amount": 200, "description": "Gym membership", "created_at" : "2024-02-15T14:00:00"},
    {"expense_id": 4, "group_id": 4, "payer_id": 4, "shared_between": 5, "amount": 300, "description": "Game console", "created_at" : "2024-02-15T14:00:00"},
    {"expense_id": 5, "group_id": 5, "payer_id": 5, "shared_between": 3, "amount": 500, "description": "Startup materials", "created_at" : "2024-02-15T14:00:00"}
]

debts = [
    {"debt_id": 1, "expenses_id": 1, "debtor_id": 2, "amount_to_pay": 50, "is_paid": False, "payed_at": None},
    {"debt_id": 2, "expenses_id": 2, "debtor_id": 3, "amount_to_pay": 40, "is_paid": True, "payed_at": "2024-05-10T20:15:00"},
    {"debt_id": 3, "expenses_id": 3, "debtor_id": 4, "amount_to_pay": 50, "is_paid": False, "payed_at":None },
    {"debt_id": 4, "expenses_id": 4, "debtor_id": 5, "amount_to_pay": 60, "is_paid": True, "payed_at": "2024-05-10T20:15:00"},
    {"debt_id": 5, "expenses_id": 5, "debtor_id": 1, "amount_to_pay": 170, "is_paid": False, "payed_at": None}
]



objectives = [
    {"id": 1, "group_id": 1, "name": "Trip to Japan", "target_amount": 5000,"created_at": "2024-02-15T14:00:00", "is_completed": False},
    {"id": 2, "group_id": 2, "name": "New Apartment", "target_amount": 10000,"created_at": "2024-02-15T14:00:00", "is_completed": False},
    {"id": 3, "group_id": 3, "name": "Fitness Challenge", "target_amount": 800,"created_at": "2024-02-15T14:00:00", "is_completed": True},
    {"id": 4, "group_id": 4, "name": "Gaming Setup", "target_amount": 2000,"created_at": "2024-02-15T14:00:00", "is_completed": False},
    {"id": 5, "group_id": 5, "name": "Startup Fund", "target_amount": 15000,"created_at": "2024-02-15T14:00:00", "is_completed": False}
]

objectives_contributions = [
    {"id": 1, "objective_id": 1, "user_id": 1, "amount_contributed": 500, "contributed_at": "2024-01-10T09:00:00"},
    {"id": 2, "objective_id": 1, "user_id": 2, "amount_contributed": 1000, "contributed_at": "2024-01-15T10:30:00"},
    {"id": 3, "objective_id": 2, "user_id": 3, "amount_contributed": 2000, "contributed_at": "2024-02-01T14:20:00"},
    {"id": 4, "objective_id": 3, "user_id": 4, "amount_contributed": 400, "contributed_at": "2024-03-05T18:45:00"},
    {"id": 5, "objective_id": 4, "user_id": 5, "amount_contributed": 150, "contributed_at": "2024-04-10T12:10:00"}
]

user_contacts = [
    { "user_id": 1, "contact_id": 2, "created_at": "2024-01-01T12:10:00"},
    { "user_id": 1, "contact_id": 3, "created_at": "2024-01-02T13:15:00"},
    { "user_id": 2, "contact_id": 4, "created_at": "2024-02-11T14:30:00"},
    { "user_id": 3, "contact_id": 5, "created_at": "2024-03-16T08:45:00"},
    { "user_id": 4, "contact_id": 1, "created_at": "2024-05-06T10:00:00"}
]

objective_to_user = [
    # Objective 1: "Trip to Japan" (Group 1: Travel Buddies)
    {"id": 1, "objective_id": 1, "user_id": 1, "created_at": "2024-01-01T12:10:00"},
    {"id": 2, "objective_id": 1, "user_id": 2, "created_at": "2024-01-02T13:15:00"},

    # Objective 2: "New Apartment" (Group 2: Roommates)
    {"id": 3, "objective_id": 2, "user_id": 3, "created_at": "2024-02-11T14:30:00"},

    # Objective 3: "Fitness Challenge" (Group 3: Gym Squad)
    {"id": 4, "objective_id": 3, "user_id": 4, "created_at": "2024-03-16T08:45:00"},

    # Objective 4: "Gaming Setup" (Group 4: Gaming Friends)
    {"id": 5, "objective_id": 4, "user_id": 5, "created_at": "2024-04-20T14:45:00"},

    # Objective 5: "Startup Fund" (Group 5: Startup Team)
    {"id": 6, "objective_id": 5, "user_id": 1, "created_at": "2024-05-05T17:20:00"},
    {"id": 7, "objective_id": 5, "user_id": 5, "created_at": "2024-05-06T10:00:00"}
]

conversations = [
    {"id": 1, "created_at": "2024-01-10T09:00:00"},
    {"id": 2, "created_at": "2024-02-15T14:30:00"},
    {"id": 3, "created_at": "2024-03-20T11:15:00"},
    {"id": 4, "created_at": "2024-04-05T16:45:00"},
    {"id": 5, "created_at": "2024-05-12T10:20:00"}
]
# Sample User_to_Conversation (participants)
user_to_conversation = [
    {"id": 1, "user_id": 1, "conversation_id": 1, "joined_at": "2024-01-10T09:00:00", "is_active": True},
    {"id": 2, "user_id": 2, "conversation_id": 1, "joined_at": "2024-01-10T09:05:00", "is_active": True},
    {"id": 3, "user_id": 3, "conversation_id": 1, "joined_at": "2024-01-10T09:10:00", "is_active": True},
    {"id": 4, "user_id": 1, "conversation_id": 2, "joined_at": "2024-02-15T14:30:00", "is_active": True},
    {"id": 5, "user_id": 4, "conversation_id": 2, "joined_at": "2024-02-15T14:35:00", "is_active": True},
    {"id": 6, "user_id": 2, "conversation_id": 3, "joined_at": "2024-03-20T11:15:00", "is_active": True},
    {"id": 7, "user_id": 3, "conversation_id": 3, "joined_at": "2024-03-20T11:20:00", "is_active": False},
    {"id": 8, "user_id": 5, "conversation_id": 4, "joined_at": "2024-04-05T16:45:00", "is_active": True},
    {"id": 9, "user_id": 1, "conversation_id": 5, "joined_at": "2024-05-12T10:20:00", "is_active": True},
    {"id": 10, "user_id": 5, "conversation_id": 5, "joined_at": "2024-05-12T10:25:00", "is_active": True}
]

# Sample Messages
messages = [
    {"id": 1, "conversation_id": 1, "from_user_id": 1, "sent_to_user_id": None, "message": "Hi team, let's discuss the project", "sent_at": "2024-01-10T09:15:00"},
    {"id": 2, "conversation_id": 1, "from_user_id": 2, "sent_to_user_id": None, "message": "Sounds good, I've prepared some notes", "sent_at": "2024-01-10T09:18:00"},
    {"id": 3, "conversation_id": 1, "from_user_id": 3, "sent_to_user_id": None, "message": "When is our deadline?", "sent_at": "2024-01-10T09:20:00"},
    {"id": 4, "conversation_id": 2, "from_user_id": 1, "sent_to_user_id": 4, "message": "Hi mom, how are you?", "sent_at": "2024-02-15T14:40:00"},
    {"id": 5, "conversation_id": 2, "from_user_id": 4, "sent_to_user_id": 1, "message": "I'm good dear, how about you?", "sent_at": "2024-02-15T14:45:00"},
    {"id": 6, "conversation_id": 3, "from_user_id": 2, "sent_to_user_id": None, "message": "Who's up for lunch tomorrow?", "sent_at": "2024-03-20T11:30:00"},
    {"id": 7, "conversation_id": 4, "from_user_id": 5, "sent_to_user_id": None, "message": "Does anyone have the study materials?", "sent_at": "2024-04-05T17:00:00"},
    {"id": 8, "conversation_id": 5, "from_user_id": 1, "sent_to_user_id": 5, "message": "Can we meet later?", "sent_at": "2024-05-12T10:30:00"},
    {"id": 9, "conversation_id": 5, "from_user_id": 5, "sent_to_user_id": 1, "message": "Sure, what time works for you?", "sent_at": "2024-05-12T10:35:00"},
    {"id": 10, "conversation_id": 1, "from_user_id": 1, "sent_to_user_id": None, "message": "The deadline is next Friday", "sent_at": "2024-01-10T09:25:00"}
]