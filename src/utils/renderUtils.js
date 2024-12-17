

/**
 * 렌더링 작업을 스케줄링하는 함수
 * @param {Object} value - 렌더링 작업에 필요한 값
 * @returns {Promise} 렌더링 작업을 담은 AsyncRenderMonad 인스턴스
 */
export const scheduleNextRenderPromise = (value) => {
  value = value ?? {};
  return Promise.resolve(value);
};