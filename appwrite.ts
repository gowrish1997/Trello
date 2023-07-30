import { Account, Client, Databases, Storage, ID } from "appwrite";
const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6488ac401f553f016665");

// Register User

const databases = new Databases(client);
const storage = new Storage(client);
export { client, databases, storage,ID };
