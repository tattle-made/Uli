import axios from "axios";
import { config } from "../components/config";

async function getAllocationForUser(userId, pageNum) {
  const { data } = await axios.get(
    `${config.api_endpoint}/allocation/for-user?userId=${userId}&pageNum=${pageNum}`
  );
  const { allocations, count } = data;
  return { allocations, count };
}

async function getUserAnnotationsForPost(userId, postId) {
  try {
    const { data } = await axios.get(
      `${config.api_endpoint}/annotation/by-user?userId=${userId}&postId=${postId}`
    );
    const { annotations } = data;
    console.log({ annotations });
    return { annotations };
  } catch (err) {
    console.log("----> ", err);
    return { error: { message: "Could not get Annotations By User" } };
  }
}

export { getAllocationForUser, getUserAnnotationsForPost };
