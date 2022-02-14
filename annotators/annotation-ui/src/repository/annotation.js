import axios from "axios";
import { config } from "../components/config";

async function saveAnnotations(userId, postId, annotations) {
  console.log("----> ", annotations);

  const annotationsArray = Object.keys(annotations).map((key) => {
    return { id: annotations[key].id, key: key, value: annotations[key].value };
  });

  return axios.post(`${config.api_endpoint}/annotations`, {
    userId,
    postId,
    annotations: annotationsArray,
  });
}

export { saveAnnotations };
