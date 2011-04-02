# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_deckbuilder_session',
  :secret      => '6b377fd1f1a75e9bf4574377a4c1fcfe269daf48c3b3a7940bd0187678b7570c83279411fe791987c5d1d47a531394112c9bb1c8b4bb66d64228eaad41ad5593'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
