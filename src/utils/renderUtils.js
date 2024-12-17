/**
 * Promise를 지원하는 렌더링 모나드 구현
 */
export const AsyncRenderMonad = {
  of: (promise) => ({
    promise,
    bind: function(transform) {
      let pro = this.promise.then( (result) => transform(result));
      return AsyncRenderMonad.of(pro);
    },
  })
};

/**
 * 렌더링 작업을 스케줄링하는 함수
 * @param {Function} renderCallback - 실행될 렌더링 콜백 함수
 * @returns {AsyncRenderMonad} 렌더링 작업을 담은 AsyncRenderMonad 인스턴스
 */
export const scheduleNextRender = (value) => {
  value = value ?? {};
  return AsyncRenderMonad.of(Promise.resolve(value));
};