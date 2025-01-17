import { useQuery } from "@tanstack/react-query";
import React from "react";

export const fetchPosts = async () => {
  // Add 'await' to resolve the fetch promise
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  if (!response.ok) throw new Error("Error fetching data");
  return response.json();
};

const Query = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 5000,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data?.map((post) => (
        // Ensure you return JSX here
        <p key={post.id}>{post.title}</p>
      ))}
    </div>
  );
};

export default Query;
