###############
# POLICY DOCS #
###############

data "aws_iam_policy_document" "rds_assume" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["rds.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "read_creds" {
  statement {
    effect    = "Allow"
    actions   = ["secretsmanager:GetSecretValue"]
    resources = [aws_secretsmanager_secret.db_creds.arn]
  }
}

data "aws_iam_policy_document" "db_connect" {
  statement {
    effect  = "Allow"
    actions = ["rds-db:connect"]
    resources = [
      "${replace(replace(aws_db_proxy.blue_green.arn, ":rds:", ":rds-db:"), ":db-proxy:", ":dbuser:")}/${var.pg_user}"
    ]
  }
}

#########
# ROLES #
#########

resource "aws_iam_role" "read_creds" {
  name_prefix        = "kg-read-creds-"
  assume_role_policy = data.aws_iam_policy_document.rds_assume.json
}

############
# POLICIES #
############

resource "aws_iam_policy" "read_creds" {
  name_prefix = "kg-read-creds-"
  policy      = data.aws_iam_policy_document.read_creds.json
}

resource "aws_iam_policy" "db_connect" {
  name_prefix = "kg-db-connect-"
  policy      = data.aws_iam_policy_document.db_connect.json
}

###################
# ATTACH POLICIES #
###################

resource "aws_iam_role_policy_attachment" "read_creds" {
  role       = aws_iam_role.read_creds.name
  policy_arn = aws_iam_policy.read_creds.arn
}
