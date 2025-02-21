/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LayoutImport } from './routes/_layout'
import { Route as AppIndexImport } from './routes/app/index'
import { Route as LayoutIndexImport } from './routes/_layout/index'
import { Route as LayoutUserImport } from './routes/_layout/user'
import { Route as LayoutAuthImport } from './routes/_layout/auth'

// Create Virtual Routes

const AboutLazyImport = createFileRoute('/about')()

// Create/Update Routes

const AboutLazyRoute = AboutLazyImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/about.lazy').then((d) => d.Route))

const LayoutRoute = LayoutImport.update({
  id: '/_layout',
  getParentRoute: () => rootRoute,
} as any)

const AppIndexRoute = AppIndexImport.update({
  id: '/app/',
  path: '/app/',
  getParentRoute: () => rootRoute,
} as any)

const LayoutIndexRoute = LayoutIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutUserRoute = LayoutUserImport.update({
  id: '/user',
  path: '/user',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutAuthRoute = LayoutAuthImport.update({
  id: '/auth',
  path: '/auth',
  getParentRoute: () => LayoutRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_layout': {
      id: '/_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutLazyImport
      parentRoute: typeof rootRoute
    }
    '/_layout/auth': {
      id: '/_layout/auth'
      path: '/auth'
      fullPath: '/auth'
      preLoaderRoute: typeof LayoutAuthImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/user': {
      id: '/_layout/user'
      path: '/user'
      fullPath: '/user'
      preLoaderRoute: typeof LayoutUserImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/': {
      id: '/_layout/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof LayoutIndexImport
      parentRoute: typeof LayoutImport
    }
    '/app/': {
      id: '/app/'
      path: '/app'
      fullPath: '/app'
      preLoaderRoute: typeof AppIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

interface LayoutRouteChildren {
  LayoutAuthRoute: typeof LayoutAuthRoute
  LayoutUserRoute: typeof LayoutUserRoute
  LayoutIndexRoute: typeof LayoutIndexRoute
}

const LayoutRouteChildren: LayoutRouteChildren = {
  LayoutAuthRoute: LayoutAuthRoute,
  LayoutUserRoute: LayoutUserRoute,
  LayoutIndexRoute: LayoutIndexRoute,
}

const LayoutRouteWithChildren =
  LayoutRoute._addFileChildren(LayoutRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof LayoutRouteWithChildren
  '/about': typeof AboutLazyRoute
  '/auth': typeof LayoutAuthRoute
  '/user': typeof LayoutUserRoute
  '/': typeof LayoutIndexRoute
  '/app': typeof AppIndexRoute
}

export interface FileRoutesByTo {
  '/about': typeof AboutLazyRoute
  '/auth': typeof LayoutAuthRoute
  '/user': typeof LayoutUserRoute
  '/': typeof LayoutIndexRoute
  '/app': typeof AppIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_layout': typeof LayoutRouteWithChildren
  '/about': typeof AboutLazyRoute
  '/_layout/auth': typeof LayoutAuthRoute
  '/_layout/user': typeof LayoutUserRoute
  '/_layout/': typeof LayoutIndexRoute
  '/app/': typeof AppIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '' | '/about' | '/auth' | '/user' | '/' | '/app'
  fileRoutesByTo: FileRoutesByTo
  to: '/about' | '/auth' | '/user' | '/' | '/app'
  id:
    | '__root__'
    | '/_layout'
    | '/about'
    | '/_layout/auth'
    | '/_layout/user'
    | '/_layout/'
    | '/app/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  LayoutRoute: typeof LayoutRouteWithChildren
  AboutLazyRoute: typeof AboutLazyRoute
  AppIndexRoute: typeof AppIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  LayoutRoute: LayoutRouteWithChildren,
  AboutLazyRoute: AboutLazyRoute,
  AppIndexRoute: AppIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_layout",
        "/about",
        "/app/"
      ]
    },
    "/_layout": {
      "filePath": "_layout.tsx",
      "children": [
        "/_layout/auth",
        "/_layout/user",
        "/_layout/"
      ]
    },
    "/about": {
      "filePath": "about.lazy.jsx"
    },
    "/_layout/auth": {
      "filePath": "_layout/auth.tsx",
      "parent": "/_layout"
    },
    "/_layout/user": {
      "filePath": "_layout/user.tsx",
      "parent": "/_layout"
    },
    "/_layout/": {
      "filePath": "_layout/index.tsx",
      "parent": "/_layout"
    },
    "/app/": {
      "filePath": "app/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
