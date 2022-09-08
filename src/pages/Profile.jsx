import {
  Avatar,
  Box,
  Container,
  HStack,
  Image,
  Stack,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams, Navigate } from "react-router-dom"
import { axiosInstance } from "../api"
import Post from "../component/Post"

const ProfilePage = () => {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const authSelector = useSelector((state) => state.auth)
  const [user, setUser] = useState({})

  const params = useParams()

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get("/users", {
        params: {
          username: params.username,
        },
      })
      setUser(response.data[0])
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchUserProfile()
  }, [])

  //

  const fetchPost = async () => {
    try {
      const response = await axiosInstance.get("/posts", {
        params: {
          _expand: "user",
          _sort: "id",
          _order: "desc",
          _page: page,
          userId: user.id,
        },
      })

      if (page === 1) {
        setPosts(response.data)
      } else {
        setPosts([...posts, ...response.data])
      }
    } catch (err) {
      console.log(err)
    }
  }

  const renderPosts = () => {
    return posts.map((val) => {
      return (
        <Post
          key={val.id.toString()}
          username={val.user.username}
          body={val.body}
          image_url={val.image_url}
          userId={val.userId}
          postId={val.id}
        ></Post>
      )
    })
  }

  useEffect(() => {
    fetchPost()
  }, [user.id])

  if (params.username === authSelector.username) {
    return <Navigate replace to="/my-profile" />
  }

  return (
    <Box backgroundColor={"#fafafa"}>
      <Container maxW={"container.md"} py="4" pb={"10"}>
        <Text fontSize={"4xl"} fontWeight={"light"}>
          Profile
        </Text>
        <Box mt={"4"}>
          <Stack>
            <HStack gap={"10"}>
              <Wrap>
                <WrapItem>
                  <Avatar
                    size="2xl"
                    name={user.username}
                    // src="https://images.unsplash.com/photo-1508185140592-283327020902?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
                  />
                </WrapItem>
              </Wrap>
              <Stack>
                <Text fontSize={"3xl"} fontWeight="bold">
                  {user.username}
                </Text>
                <Text fontSize={"2xl"}>{user.email}</Text>
                <Text fontSize={"2xl"} fontWeight="light">
                  {user.role}
                </Text>
              </Stack>
            </HStack>
          </Stack>
          <Stack>{renderPosts()}</Stack>
        </Box>
      </Container>
    </Box>
  )
}
export default ProfilePage
