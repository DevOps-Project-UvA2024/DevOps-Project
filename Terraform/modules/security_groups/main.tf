# Load Balancer Security Group
resource "aws_security_group" "eduapp_lb_sg" {
  name        = "eduapp_lb_sg"
  description = "Security group for Load Balancer"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "eduapp_lb_sg"
  }
}

# Backend Security Group
resource "aws_security_group" "eduapp_backend_sg" {
  name        = "eduapp_backend_sg"
  description = "Security group for backend services"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 3001
    to_port         = 3001
    protocol        = "tcp"
    security_groups = [aws_security_group.eduapp_lb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "eduapp_backend_sg"
  }
}

# ECR Security Group
resource "aws_security_group" "eduapp_ecr_sg" {
  name        = "eduapp_ecr_sg"
  description = "Security group for ECR"
  vpc_id      = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "eduapp_ecr_sg"
  }
}

# RDS Security Group
resource "aws_security_group" "eduapp_rds_sg" {
  name        = "eduapp_rds_sg"
  description = "Security group for RDS"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.eduapp_ecr_sg.id, aws_security_group.eduapp_backend_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "eduapp_rds_sg"
  }
}

# Creating route table for private subnets to use the NAT Gateway
resource "aws_route_table" "eduapp_private_rt" {
  vpc_id = var.vpc_id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = var.eduapp_nat_gateway_id
  }

  tags = {
    Name = "eduapp_private_rt"
  }
}

# Associating private subnets with the route table
resource "aws_route_table_association" "eduapp_private_rt_assoc_1" {
  subnet_id      = var.eduapp_private_subnet_1_id
  route_table_id = aws_route_table.eduapp_private_rt.id
}

resource "aws_route_table_association" "eduapp_private_rt_assoc_2" {
  subnet_id      = var.eduapp_private_subnet_2_id
  route_table_id = aws_route_table.eduapp_private_rt.id
}
