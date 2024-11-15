-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 15, 2024 at 04:47 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `readapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `MaSach` int(11) NOT NULL,
  `TenSach` varchar(500) NOT NULL,
  `HinhAnh` text NOT NULL,
  `TacGia` varchar(255) NOT NULL,
  `NamXuatBan` int(11) NOT NULL,
  `TepTin` text NOT NULL,
  `MaChuyenMuc` int(11) NOT NULL,
  `LuotDoc` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`MaSach`, `TenSach`, `HinhAnh`, `TacGia`, `NamXuatBan`, `TepTin`, `MaChuyenMuc`, `LuotDoc`, `createdAt`, `updatedAt`) VALUES
(1, 'Mắt Biếc', '/uploads/book/image/1731683091788.jfif', 'Nguyễn Nhật Ánh', 2020, '/uploads/book/pdf/1731683046775.pdf', 1, 0, '2024-11-15 15:04:06', '2024-11-15 15:04:51'),
(2, 'Mắt Biếc 1', '/uploads/book/image/1731683707283.jfif', 'Nguyễn Nhật Ánh', 2021, '/uploads/book/pdf/1731683707287.pdf', 1, 0, '2024-11-15 15:15:07', '2024-11-15 15:15:07');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `MaChuyenMuc` int(11) NOT NULL,
  `TenChuyenMuc` varchar(255) NOT NULL,
  `HinhAnh` text NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`MaChuyenMuc`, `TenChuyenMuc`, `HinhAnh`, `createdAt`, `updatedAt`) VALUES
(1, 'Sách Triết Lí', '/uploads/category/1731682028953.jpg', '2024-11-15 14:31:48', '2024-11-15 14:47:08');

-- --------------------------------------------------------

--
-- Table structure for table `libraries`
--

CREATE TABLE `libraries` (
  `MaThuVien` int(11) NOT NULL,
  `MaNguoiDung` int(11) NOT NULL,
  `MaSach` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `slides`
--

CREATE TABLE `slides` (
  `MaSlide` int(11) NOT NULL,
  `HinhAnh` text NOT NULL,
  `MaChuyenMuc` int(11) DEFAULT NULL,
  `MaSach` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `slides`
--

INSERT INTO `slides` (`MaSlide`, `HinhAnh`, `MaChuyenMuc`, `MaSach`, `createdAt`, `updatedAt`) VALUES
(1, '/uploads/slide/1731684844115.jpg', 1, NULL, '2024-11-15 15:31:35', '2024-11-15 15:34:04'),
(2, '/uploads/slide/1731684864772.jpg', NULL, 1, '2024-11-15 15:34:24', '2024-11-15 15:40:15');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `MaNguoiDung` int(11) NOT NULL,
  `HoTen` varchar(255) NOT NULL,
  `TaiKhoan` varchar(255) NOT NULL,
  `SoDienThoai` varchar(11) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `MatKhau` varchar(255) NOT NULL,
  `PhanQuyen` enum('admin','user','staff') NOT NULL,
  `TrangThai` enum('activate','blocked') NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`MaSach`),
  ADD KEY `MaChuyenMuc` (`MaChuyenMuc`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`MaChuyenMuc`);

--
-- Indexes for table `libraries`
--
ALTER TABLE `libraries`
  ADD PRIMARY KEY (`MaThuVien`),
  ADD KEY `MaNguoiDung` (`MaNguoiDung`),
  ADD KEY `MaSach` (`MaSach`);

--
-- Indexes for table `slides`
--
ALTER TABLE `slides`
  ADD PRIMARY KEY (`MaSlide`),
  ADD KEY `MaChuyenMuc` (`MaChuyenMuc`,`MaSach`),
  ADD KEY `MaSach` (`MaSach`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`MaNguoiDung`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `MaSach` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `MaChuyenMuc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `libraries`
--
ALTER TABLE `libraries`
  MODIFY `MaThuVien` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `slides`
--
ALTER TABLE `slides`
  MODIFY `MaSlide` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `MaNguoiDung` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `books_ibfk_1` FOREIGN KEY (`MaChuyenMuc`) REFERENCES `categories` (`MaChuyenMuc`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `libraries`
--
ALTER TABLE `libraries`
  ADD CONSTRAINT `libraries_ibfk_1` FOREIGN KEY (`MaNguoiDung`) REFERENCES `users` (`MaNguoiDung`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `libraries_ibfk_2` FOREIGN KEY (`MaSach`) REFERENCES `books` (`MaSach`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `slides`
--
ALTER TABLE `slides`
  ADD CONSTRAINT `slides_ibfk_1` FOREIGN KEY (`MaChuyenMuc`) REFERENCES `categories` (`MaChuyenMuc`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `slides_ibfk_2` FOREIGN KEY (`MaSach`) REFERENCES `books` (`MaSach`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
