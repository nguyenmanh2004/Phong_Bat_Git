import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json"; // Đường dẫn tới file data.json

// Hàm kiểm tra xem ngày có hợp lệ không (trong khoảng thời gian nhất định)
const isValidDate = (date) => {
  const startDate = moment("2019-01-01");
  const endDate = moment("2024-12-13");
  return date.isBetween(startDate, endDate, null, "[)") // Kiểm tra ngày có trong khoảng 2019-01-01 đến 2024-12-13 không
};

// Hàm tạo commit mới và ghi vào file data.json
const markCommit = async (date) => {
  const data = { date: date.toISOString() }; // Tạo dữ liệu commit
  await jsonfile.writeFile(path, data); // Ghi dữ liệu vào file
  const git = simpleGit(); // Khởi tạo git
  await git.add([path]); // Thêm file vào git
  await git.commit(date.toISOString(), { "--date": date.toISOString() }); // Tạo commit với ngày tương ứng
};

// Hàm tạo nhiều commit ngẫu nhiên
const makeCommits = async (n) => {
  const git = simpleGit(); // Khởi tạo git

  // Lặp qua n lần để tạo các commit
  for (let i = 0; i < n; i++) {
    const randomWeeks = random.int(0, 54 * 4); // Tạo tuần ngẫu nhiên
    const randomDays = random.int(0, 6); // Tạo ngày ngẫu nhiên

    // Tính toán ngày commit ngẫu nhiên bắt đầu từ 2019-01-01
    const randomDate = moment("2019-01-01")
      .add(randomWeeks, "weeks")
      .add(randomDays, "days");

    // Kiểm tra xem ngày có hợp lệ không
    if (isValidDate(randomDate)) {
      console.log(`Creating commit: ${randomDate.toISOString()}`);
      await markCommit(randomDate); // Nếu hợp lệ, tạo commit
    } else {
      console.log(`Invalid date: ${randomDate.toISOString()}, skipping...`);
    }
  }

  console.log("Pushing all commits...");
  await git.push(); // Đẩy tất cả commit lên GitHub
};

makeCommits(50); // Gọi hàm để tạo 50,000 commit (hoặc số lượng bạn muốn)
