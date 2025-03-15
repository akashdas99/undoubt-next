"use client";
import React from "react";
import { uploadData } from "aws-amplify/storage";
import { Amplify } from "aws-amplify";
Amplify.configure({
  Auth: {
    Cognito: {
      identityPoolId: process.env.NEXT_PUBLIC_IDENTITYPOOLID!,
      allowGuestAccess: true,
    },
  },
  Storage: {
    S3: {
      bucket: process.env.NEXT_PUBLIC_BUCKETNAME!,
      region: process.env.NEXT_PUBLIC_BUCKETREGION!,
    },
  },
});

export default function ImageUpload() {
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files && e?.target?.files?.length > 0) {
      const file = e.target.files[0];
      console.log(e?.target?.files?.length && e.target.files[0]);
      console.log({
        path: `test-img/${file.name}`,
        data: file,
      });
      await uploadData({
        path: `test-img/${file.name}`,
        data: file,
        options: {
          // content-type header to be used when downloading
          contentType: "image/jpg",
        },
      });
    }
  };
  return (
    <div>
      <input type="file" accept="image/*" onChange={handleChange} />
    </div>
  );
}
