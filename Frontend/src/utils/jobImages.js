import construction from "../assets/FindWork-images/construction.jpg";
import painter from "../assets/FindWork-images/Painter.jpg";
import mason from "../assets/FindWork-images/Mason.jpg";
import labour from "../assets/FindWork-images/Labour.jpg";
import factory from "../assets/FindWork-images/FactoryHelper.jpg";
import electrician from "../assets/FindWork-images/Electrician.jpg";
import carpenter from "../assets/FindWork-images/Carpenter.jpg";
import plumber from "../assets/FindWork-images/plumber.jpg";
import defaultImg from "../assets/FindWork-images/default.jpg";

export const jobImageMap = {
  "construction helper": construction,
  "painter": painter,
  "mason": mason,
  "labour": labour,
  "factory worker": factory,
  "electrician helper": electrician,
  "carpenter": carpenter,
  "plumber": plumber,
};

export const getJobImage = (title) => {
  if (!title) return defaultImg;

  const key = title.toLowerCase();
  return jobImageMap[key] || defaultImg;
};
