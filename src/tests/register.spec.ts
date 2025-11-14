import { ResolvedRoute, Router, RouterRoute, useRoute, useRouter, RegisteredRouterRoute, RegisteredRoutesName } from "@kitbag/router";
import { describe, expectTypeOf, test } from "vitest";
import { router, routes } from "../router";

test('useRouter has correct types', () => {
  type InstalledRouter = ReturnType<typeof useRouter>

  type Source = InstalledRouter extends Router<infer T> ? T : never
  type Expect = typeof routes

  expectTypeOf<Source>().toEqualTypeOf<Expect>()
})

test('useRoute has correct types', () => {
  type Source = ReturnType<typeof useRoute>
  type Expect = RouterRoute<ResolvedRoute<typeof routes[number]>>

  expectTypeOf<Source>().toExtend<Expect>()
})

test('router rejections are correct type', () => {
  type Reject = typeof router['reject']
  
  type Source = Reject extends (...args: [infer RejectionType]) => any ? RejectionType : never
  type Expect = 'NotAuthorized' | 'NotFound'

  expectTypeOf<Source>().toEqualTypeOf<Expect>()
})

describe('useRoute', () => {
  test('useRoute with no arguments should return RegisteredRouterRoute', () => {
    const route = useRoute()
    expectTypeOf(route).toEqualTypeOf<RegisteredRouterRoute>()
  })

  test('useRoute should constrain route name parameter to RegisteredRoutesName', () => {
    // @ts-expect-error - should not accept arbitrary strings that are not registered route names
    useRoute('nonExistentRoute123456')
  })

  test('useRoute with exact: true should narrow the route name type', () => {
    const route = useRoute('settings', { exact: true })

    expectTypeOf(route.name).toEqualTypeOf<'settings'>()
  })

  test('useRoute without exact option should allow child routes', () => {
    const route = useRoute('settings')

    expectTypeOf(route.name).toEqualTypeOf<'settings' | 'settings.profile' | 'settings.keys'>()
  })

  test('route return type should not be any', () => {
    const route = useRoute()

    // Make sure we're not getting any types
    expectTypeOf(route).not.toBeAny()
    expectTypeOf(route.name).not.toBeAny()
    expectTypeOf(route.params).not.toBeAny()
    expectTypeOf(route.query).not.toBeAny()
  })

  test('route parameter type should be constrained', () => {
    // This tests that TRouteName extends RegisteredRoutesName
    type RouteNameParam = Parameters<typeof useRoute>[0]

    expectTypeOf<RouteNameParam>().toEqualTypeOf<RegisteredRoutesName>()
    expectTypeOf<RouteNameParam>().not.toEqualTypeOf<string | undefined>()
  })
})