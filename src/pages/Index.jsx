import React, { useState, useEffect } from "react";
import { Container, Table, Thead, Tbody, Tr, Th, Td, Button, VStack, HStack, Input, FormControl, FormLabel, Select, useToast, IconButton } from "@chakra-ui/react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const Index = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", password: "", role: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    // Fetch users from the database (mocked here)
    setUsers([
      { id: 1, username: "john_doe", role: "Admin" },
      { id: 2, username: "jane_doe", role: "User" },
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddUser = () => {
    if (form.username && form.password && form.role) {
      const newUser = { id: users.length + 1, ...form };
      setUsers([...users, newUser]);
      setForm({ username: "", password: "", role: "" });
      toast({ title: "User added successfully", status: "success", duration: 2000, isClosable: true });
    } else {
      toast({ title: "Please fill all fields", status: "error", duration: 2000, isClosable: true });
    }
  };

  const handleEditUser = (user) => {
    setIsEditing(true);
    setEditUserId(user.id);
    setForm({ username: user.username, password: "", role: user.role });
  };

  const handleUpdateUser = () => {
    if (form.username && form.role) {
      setUsers(users.map((user) => (user.id === editUserId ? { ...user, ...form } : user)));
      setForm({ username: "", password: "", role: "" });
      setIsEditing(false);
      setEditUserId(null);
      toast({ title: "User updated successfully", status: "success", duration: 2000, isClosable: true });
    } else {
      toast({ title: "Please fill all fields", status: "error", duration: 2000, isClosable: true });
    }
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
    toast({ title: "User deleted successfully", status: "success", duration: 2000, isClosable: true });
  };

  return (
    <Container maxW="container.xl" py={6}>
      <VStack spacing={6}>
        <HStack spacing={4}>
          <FormControl id="username">
            <FormLabel>Username</FormLabel>
            <Input name="username" value={form.username} onChange={handleInputChange} />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input type="password" name="password" value={form.password} onChange={handleInputChange} />
          </FormControl>
          <FormControl id="role">
            <FormLabel>Role</FormLabel>
            <Select name="role" value={form.role} onChange={handleInputChange}>
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </Select>
          </FormControl>
          <Button onClick={isEditing ? handleUpdateUser : handleAddUser} colorScheme="blue">
            {isEditing ? "Update User" : "Add User"}
          </Button>
        </HStack>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Username</Th>
              <Th>Role</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.id}</Td>
                <Td>{user.username}</Td>
                <Td>{user.role}</Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton aria-label="Edit" icon={<FaEdit />} onClick={() => handleEditUser(user)} />
                    <IconButton aria-label="Delete" icon={<FaTrash />} onClick={() => handleDeleteUser(user.id)} />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Container>
  );
};

export default Index;
