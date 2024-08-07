export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = cFormat || "{m}-{d}-{y} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string") {
      if (/^[0-9]+$/.test(time)) {
        time = parseInt(time);
      } else {
        time = time.replace(new RegExp(/-/gm), "/");
      }
    }

    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat"][value];
    }
    return value.toString().padStart(2, "0");
  });
  return time_str;
}

export function formatTime(time, option) {
  if (("" + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "Just now";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "Mins ago";
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "Hours ago";
  } else if (diff < 3600 * 24 * 2) {
    return "A day ago";
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      "" +
      d.getMonth() +
      1 +
      " " +
      d.getDate() +
      ", " +
      d.getHours() +
      " : " +
      d.getMinutes()
    );
  }
}

export function param2Obj(url) {
  const search = decodeURIComponent(url.split("?")[1]).replace(/\+/g, " ");
  if (!search) {
    return {};
  }
  const obj = {};
  const searchArr = search.split("&");
  searchArr.forEach((v) => {
    const index = v.indexOf("=");
    if (index !== -1) {
      const name = v.substring(0, index);
      const val = v.substring(index + 1, v.length);
      obj[name] = val;
    }
  });
  return obj;
}
