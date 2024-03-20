# VPC
resource "aws_vpc" "eduapp_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "eduapp_vpc"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "eduapp_igw" {
  vpc_id = aws_vpc.eduapp_vpc.id

  tags = {
    Name = "eduapp_igw"
  }
}

# Public Subnets
resource "aws_subnet" "eduapp_public_subnet_1" {
  vpc_id            = aws_vpc.eduapp_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "eu-north-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "eduapp_public_subnet_1"
  }
}

resource "aws_subnet" "eduapp_public_subnet_2" {
  vpc_id            = aws_vpc.eduapp_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "eu-north-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "eduapp_public_subnet_2"
  }
}

# Private Subnets
resource "aws_subnet" "eduapp_private_subnet_1" {
  vpc_id            = aws_vpc.eduapp_vpc.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "eu-north-1a"

  tags = {
    Name = "eduapp_private_subnet_1"
  }
}

resource "aws_subnet" "eduapp_private_subnet_2" {
  vpc_id            = aws_vpc.eduapp_vpc.id
  cidr_block        = "10.0.4.0/24"
  availability_zone = "eu-north-1b"

  tags = {
    Name = "eduapp_private_subnet_2"
  }
}

resource "aws_eip" "eduapp_nat_eip" {
  tags = {
    Name = "eduapp_nat_eip"
  }
}

resource "aws_nat_gateway" "eduapp_nat_gateway" {
  allocation_id = aws_eip.eduapp_nat_eip.id
  subnet_id     = aws_subnet.eduapp_public_subnet_1.id

  tags = {
    Name = "eduapp_nat_gateway"
  }
}

# Route Table for public subnets with default route to Internet Gateway
resource "aws_route_table" "eduapp_public_rt" {
  vpc_id = aws_vpc.eduapp_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.eduapp_igw.id
  }

  tags = {
    Name = "eduapp_public_rt"
  }
}

# Route Table Associations for public subnets
resource "aws_route_table_association" "eduapp_public_rta_1" {
  subnet_id      = aws_subnet.eduapp_public_subnet_1.id
  route_table_id = aws_route_table.eduapp_public_rt.id
}

resource "aws_route_table_association" "eduapp_public_rta_2" {
  subnet_id      = aws_subnet.eduapp_public_subnet_2.id
  route_table_id = aws_route_table.eduapp_public_rt.id
}

# Route Table for private subnets with default route to NAT Gateway
resource "aws_route_table" "eduapp_private_rt" {
  vpc_id = aws_vpc.eduapp_vpc.id

  route {
    cidr_block    = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.eduapp_nat_gateway.id
  }

  tags = {
    Name = "eduapp_private_rt"
  }
}
