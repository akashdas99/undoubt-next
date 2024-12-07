"use server";
export async function registerUser(user: {
  name: string;
  username: string;
  password: string;
  profession: string;
  city: string;
  country: string;
}) {
  try {
    const res = await fetch(`${process.env.REACT_APP_BACKEND}/signup`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await res.json();
  } catch (e) {
    console.log(e);
  }
}
