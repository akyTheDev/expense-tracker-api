INSERT INTO "user" (id, email, name, password)
  VALUES
-- Password -> test1234
(1, 'test@test1.com', 'Test User1', '$2b$10$ueKQeBpHbWgB7ofBZOgvO.5QtrhcnkAuTFxHYRovkrKbg5dsSNfvW'),
(2, 'test@test2.com', 'Test User2', '$2b$10$ueKQeBpHbWgB7ofBZOgvO.5QtrhcnkAuTFxHYRovkrKbg5dsSNfvW'),
(3, 'test@test3.com', 'Test User3', '$2b$10$ueKQeBpHbWgB7ofBZOgvO.5QtrhcnkAuTFxHYRovkrKbg5dsSNfvW');

INSERT INTO public.credit_card (id, name, "userId") 
  VALUES
(1, 'User 1 Card 1', 1),
(2, 'User 1 Card 2', 1),
(3, 'User 2 Card 1', 2),
(4, 'User 2 Card 2', 2);

