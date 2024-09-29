"use server";
export async function getQuestions (search: string) {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND}/search/questions/?q=${search}`
    );
    return await res.json();
  };