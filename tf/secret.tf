##########
# SECRET #
##########

resource "aws_secretsmanager_secret" "db_creds" {
  name_prefix = "kg-db-creds-"
}

resource "aws_secretsmanager_secret_version" "db_creds" {
  secret_id = aws_secretsmanager_secret.db_creds.id
  secret_string = jsonencode({
    username = var.pg_user
    password = var.pg_pass
  })
}
