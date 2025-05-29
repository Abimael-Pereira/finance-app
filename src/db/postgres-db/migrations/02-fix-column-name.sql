ALTER TYPE transaction_type 
    RENAME VALUE 'ESPENSE' TO 'EXPENSE';

ALTER TABLE transactions
    RENAME COLUMN amout TO amount;