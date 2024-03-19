# DB Subnet Group
resource "aws_db_subnet_group" "eduapp_db_subnet_group" {
  name       = "eduapp-db-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name = "eduapp-db-subnet-group"
  }
}

# RDS Instance
resource "aws_db_instance" "eduapp_db_instance" {
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "mysql"
  engine_version       = "8.0"
  instance_class       = "db.t3.micro"
  username             = "root"
  password             = var.db_password
  parameter_group_name = "default.mysql8.0"
  db_subnet_group_name = aws_db_subnet_group.eduapp_db_subnet_group.name
  vpc_security_group_ids = [var.rds_security_group_id]
  skip_final_snapshot  = true

  tags = {
    Name = "eduapp-db-instance"
  }
}
