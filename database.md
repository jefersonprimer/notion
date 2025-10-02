-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.notes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  title text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  is_deleted boolean NOT NULL DEFAULT false,
  deleted_at timestamp with time zone,
  updated_at timestamp with time zone DEFAULT now(),
  is_favorite boolean NOT NULL DEFAULT false,
  CONSTRAINT notes_pkey PRIMARY KEY (id),
  CONSTRAINT notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  display_name text,
  avatar_url text,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
