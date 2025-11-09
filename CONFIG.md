# Configuration File - Cấu hình Chrome Profile và Executable Path

# ========================================
# CẤU HÌNH HIỆN TẠI
# ========================================

## Chrome Executable Path
E:\temp\VEO_3_create-16-10\creatve_viodeo\browser133\chrome.exe

## Profile Directory (User Data)
E:\temp\VEO_3_create-16-10\creatve_viodeo\profile

## Profile Name
Profile 1

# ========================================
# HƯỚNG DẪN THAY ĐỔI CẤU HÌNH
# ========================================

Nếu bạn cần thay đổi profile hoặc Chrome path, sửa trong các file sau:

## 1. JavaScript Files:
- extract-cookies.js (lines 15-16, 28)
- sora-with-profile.js (lines 9-10, 13)

## 2. Batch Files:
- start-chrome-debug.bat (lines 36, 39, 41-42)
- RUN-ONE-CLICK.bat (lines 20, 22-23)

# ========================================
# TÌM CHROME PROFILE CỦA BẠN
# ========================================

## Cách 1: Mở Chrome và gõ:
chrome://version

Tìm dòng "Profile Path", ví dụ:
E:\temp\VEO_3_create-16-10\creatve_viodeo\profile\Profile 1

Tách thành:
- User Data Dir: E:\temp\VEO_3_create-16-10\creatve_viodeo\profile
- Profile Directory: Profile 1

## Cách 2: Tìm thủ công:
1. Mở File Explorer
2. Paste vào address bar: %LOCALAPPDATA%\Google\Chrome\User Data
3. Xem các thư mục Profile 1, Profile 2, Default, etc.

# ========================================
# TÌM CHROME EXECUTABLE
# ========================================

## Vị trí mặc định:
C:\Program Files\Google\Chrome\Application\chrome.exe

## Hoặc:
C:\Program Files (x86)\Google\Chrome\Application\chrome.exe

## Chrome Portable hoặc Custom:
Kiểm tra nơi bạn cài đặt Chrome
