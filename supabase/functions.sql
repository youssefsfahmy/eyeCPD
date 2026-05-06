CREATE
OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $ $ BEGIN RAISE NOTICE 'Trigger fired for user_id: %',
new.id;

INSERT INTO
    public.profiles (user_id, first_name, last_name, roles, email)
VALUES
    (
        new.id,
        '',
        '',
        ARRAY ['optometrist'],
        new.email
    );

RETURN new;

END;

$ $ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- CUSTOM ACCESS TOKEN HOOK
-- Injects profile and subscription data into JWT claims
-- Must be SECURITY DEFINER to bypass RLS
-- ============================================
CREATE
OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER
SET
    search_path = public AS $ $ declare claims jsonb;

event_user_id uuid;

profile_data jsonb;

subscription_data jsonb;

begin event_user_id := (event ->> 'user_id') :: uuid;

claims := event -> 'claims';

select
    to_jsonb(p.*) into profile_data
from
    public.profiles p
where
    p.user_id = event_user_id;

select
    to_jsonb(s.*) into subscription_data
from
    public.subscriptions s
where
    s.user_id = event_user_id;

if profile_data is not null then claims := jsonb_set(claims, '{profile}', profile_data);

end if;

if subscription_data is not null then claims := jsonb_set(claims, '{subscription}', subscription_data);

end if;

return jsonb_set(event, '{claims}', claims);

end;

$ $;

-- Grant permissions for the auth hook
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;

GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;