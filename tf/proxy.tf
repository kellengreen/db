#########
# PROXY #
#########

resource "aws_db_proxy" "blue_green" {
  name                   = "kg-blue-green"
  engine_family          = "POSTGRESQL"
  vpc_subnet_ids         = [var.subnet_a, var.subnet_b]
  vpc_security_group_ids = var.security_groups
  role_arn               = aws_iam_role.read_creds.arn
  require_tls            = true
  debug_logging          = true

  auth {
    auth_scheme               = "SECRETS"
    iam_auth                  = "REQUIRED"
    client_password_auth_type = "POSTGRES_SCRAM_SHA_256"
    secret_arn                = aws_secretsmanager_secret.db_creds.arn
  }
}

resource "aws_db_proxy_default_target_group" "blue_green" {
  db_proxy_name = aws_db_proxy.blue_green.name
}

resource "aws_db_proxy_target" "blue_green" {
  db_proxy_name         = aws_db_proxy.blue_green.name
  target_group_name     = aws_db_proxy_default_target_group.blue_green.name
  db_cluster_identifier = aws_rds_cluster.green.id
}

