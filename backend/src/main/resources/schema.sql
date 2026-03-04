DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'olympic_winners' AND column_name = 'id'
    ) THEN
        ALTER TABLE olympic_winners ADD COLUMN id SERIAL;

        UPDATE olympic_winners o SET id = sub.rn
        FROM (SELECT ctid, ROW_NUMBER() OVER () AS rn FROM olympic_winners) sub
        WHERE o.ctid = sub.ctid;

        PERFORM setval('olympic_winners_id_seq', (SELECT COALESCE(MAX(id), 1) FROM olympic_winners));

        ALTER TABLE olympic_winners ADD CONSTRAINT olympic_winners_pkey PRIMARY KEY (id);
    END IF;
END $$^;
