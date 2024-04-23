import { useState, useEffect } from "react";
import { Box, Heading, Text, Button, Input, Textarea, Stack, IconButton, Flex, useToast } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "https://hopeful-desire-21262e95c7.strapiapp.com/api/articles";

const Index = () => {
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingArticleId, setEditingArticleId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setArticles(data.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const createArticle = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            title,
            description,
          },
        }),
      });
      const data = await response.json();
      setArticles([...articles, data.data]);
      setTitle("");
      setDescription("");
      toast({
        title: "Article created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error creating article:", error);
    }
  };

  const updateArticle = async () => {
    try {
      const response = await fetch(`${API_URL}/${editingArticleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            title,
            description,
          },
        }),
      });
      const data = await response.json();
      setArticles(articles.map((article) => (article.id === editingArticleId ? data.data : article)));
      setTitle("");
      setDescription("");
      setEditingArticleId(null);
      toast({
        title: "Article updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  const deleteArticle = async (articleId) => {
    try {
      await fetch(`${API_URL}/${articleId}`, {
        method: "DELETE",
      });
      setArticles(articles.filter((article) => article.id !== articleId));
      toast({
        title: "Article deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  const startEditing = (article) => {
    setTitle(article.attributes.title);
    setDescription(article.attributes.description);
    setEditingArticleId(article.id);
  };

  return (
    <Box maxWidth="600px" margin="auto" padding={4}>
      <Heading as="h1" size="xl" marginBottom={4}>
        Article Management
      </Heading>

      <Stack spacing={4} marginBottom={8}>
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button colorScheme="blue" leftIcon={<FaPlus />} onClick={editingArticleId ? updateArticle : createArticle}>
          {editingArticleId ? "Update Article" : "Create Article"}
        </Button>
      </Stack>

      {articles.map((article) => (
        <Box key={article.id} borderWidth={1} borderRadius="md" padding={4} marginBottom={4}>
          <Flex justify="space-between" align="center">
            <Box>
              <Heading as="h2" size="md">
                {article.attributes.title}
              </Heading>
              <Text>{article.attributes.description}</Text>
            </Box>
            <Box>
              <IconButton icon={<FaEdit />} marginRight={2} onClick={() => startEditing(article)} />
              <IconButton icon={<FaTrash />} onClick={() => deleteArticle(article.id)} />
            </Box>
          </Flex>
        </Box>
      ))}
    </Box>
  );
};

export default Index;
