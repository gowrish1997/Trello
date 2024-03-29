import { storage } from "@/appwrite";
import { Image } from "@/typing";
const getUrl = async (image: Image) => {
  const url = storage.getFilePreview(image.bucketId, image.fileId);
  return url;
};
export default getUrl;
