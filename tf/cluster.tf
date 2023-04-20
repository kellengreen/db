##########
# PARAMS #
##########

resource "aws_rds_cluster_parameter_group" "blue" {
  name_prefix = "kg-blue-"
  family      = "aurora-postgresql15"

  parameter {
    name         = "rds.logical_replication"
    value        = "1"
    apply_method = "pending-reboot"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_rds_cluster_parameter_group" "green" {
  name_prefix = "kg-green-"
  family      = "aurora-postgresql14"

  parameter {
    name         = "rds.logical_replication"
    value        = "1"
    apply_method = "pending-reboot"
  }

  lifecycle {
    create_before_destroy = true
  }
}

############
# CLUSTERS #
############

resource "aws_rds_cluster" "blue" {
  cluster_identifier_prefix       = "kg-blue-"
  engine                          = "aurora-postgresql"
  engine_mode                     = "provisioned"
  engine_version                  = "15.2"
  database_name                   = var.pg_db
  master_username                 = var.pg_user
  master_password                 = var.pg_pass
  db_cluster_parameter_group_name = aws_rds_cluster_parameter_group.blue.name
  db_subnet_group_name            = var.subnet_group
  vpc_security_group_ids          = var.security_groups
  iam_roles                       = []
  skip_final_snapshot             = true
  allow_major_version_upgrade     = true
  apply_immediately               = true
}

resource "aws_rds_cluster" "green" {
  cluster_identifier_prefix       = "kg-green-"
  engine                          = "aurora-postgresql"
  engine_mode                     = "provisioned"
  engine_version                  = "14.5"
  database_name                   = var.pg_db
  master_username                 = var.pg_user
  master_password                 = var.pg_pass
  db_cluster_parameter_group_name = aws_rds_cluster_parameter_group.green.name
  db_subnet_group_name            = var.subnet_group
  vpc_security_group_ids          = var.security_groups
  iam_roles                       = []
  skip_final_snapshot             = true
  allow_major_version_upgrade     = true
  apply_immediately               = true
}

#############
# INSTANCES #
#############

resource "aws_rds_cluster_instance" "blue" {
  cluster_identifier  = aws_rds_cluster.blue.id
  engine              = aws_rds_cluster.blue.engine
  count               = 1
  identifier          = "kg-blue-${count.index}"
  instance_class      = "db.t4g.medium"
  publicly_accessible = true
}

resource "aws_rds_cluster_instance" "green" {
  cluster_identifier  = aws_rds_cluster.green.id
  engine              = aws_rds_cluster.green.engine
  count               = 1
  identifier          = "kg-green-${count.index}"
  instance_class      = "db.t4g.medium"
  publicly_accessible = true
}
