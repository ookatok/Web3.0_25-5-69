import { db } from "@/infrastructure/db/client";
import { DrizzleUserRepository } from "@/infrastructure/repositories/drizzle-user-repository";
import { BcryptPasswordHasher } from "@/infrastructure/auth/bcrypt-password-hasher";
import { DrizzlePostRepository } from "@/infrastructure/repositories/drizzle-post-repository";
import { CreatePost } from "@/application/use-cases/blog/create-post";
import { UpdatePost } from "@/application/use-cases/blog/update-post";
import { DeletePost } from "@/application/use-cases/blog/delete-post";
import { ListPosts } from "@/application/use-cases/blog/list-posts";
import { GetPostBySlug } from "@/application/use-cases/blog/get-post-by-slug";

import { VerifyCredentials } from "@/application/use-cases/auth/verify-credentials";

import { DrizzleProjectRepository } from "@/infrastructure/repositories/drizzle-project-repository";
import { CreateProject } from "@/application/use-cases/portfolio/create-project";
import { UpdateProject } from "@/application/use-cases/portfolio/update-project";
import { DeleteProject } from "@/application/use-cases/portfolio/delete-project";
import { ListProjects } from "@/application/use-cases/portfolio/list-projects";
import { GetProjectBySlug } from "@/application/use-cases/portfolio/get-project-by-slug";

import { DrizzleContactRepository } from "@/infrastructure/repositories/drizzle-contact-repository";
import { CreateContact } from "@/application/use-cases/contact/create-contact";
import { ListContacts } from "@/application/use-cases/contact/list-contacts";

const userRepository = new DrizzleUserRepository(db);
const passwordHasher = new BcryptPasswordHasher();
const verifyCredentials = new VerifyCredentials(userRepository, passwordHasher);

const postRepository = new DrizzlePostRepository(db);
const createPost = new CreatePost(postRepository);
const updatePost = new UpdatePost(postRepository);
const deletePost = new DeletePost(postRepository);
const listPosts = new ListPosts(postRepository);
const getPostBySlug = new GetPostBySlug(postRepository);

const projectRepository = new DrizzleProjectRepository(db);
const createProject = new CreateProject(projectRepository);
const updateProject = new UpdateProject(projectRepository);
const deleteProject = new DeleteProject(projectRepository);
const listProjects = new ListProjects(projectRepository);
const getProjectBySlug = new GetProjectBySlug(projectRepository);

const contactRepository = new DrizzleContactRepository(db);
const createContact = new CreateContact(contactRepository);
const listContacts = new ListContacts(contactRepository);

export const container = {
  userRepository,
  passwordHasher,
  verifyCredentials,
  postRepository,
  createPost,
  updatePost,
  deletePost,
  listPosts,
  getPostBySlug,
  projectRepository,
  createProject,
  updateProject,
  deleteProject,
  listProjects,
  getProjectBySlug,
  contactRepository,
  createContact,
  listContacts,
};

export type ContainerType = typeof container;
