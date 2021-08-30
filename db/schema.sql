-- Table: public.meetings

--delete from meetings;


DROP TABLE public.meetings;
DROP SEQUENCE public.meetings_id_seq;

CREATE SEQUENCE public.meetings_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public.meetings_id_seq
    OWNER TO postgres;

--CREATE SEQUENCE meetings_id_seq START 1;
--commit;
CREATE TABLE public.meetings
(
    id integer NOT NULL DEFAULT nextval('meetings_id_seq'::regclass),
    StartTime time without time zone,
    EndTime time without time zone,
    Members integer,
    Room character(1) COLLATE pg_catalog."default",
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT meetings_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.meetings
    OWNER to postgres;
commit;