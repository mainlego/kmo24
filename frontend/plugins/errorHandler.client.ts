import { useToast } from '~/composables/useToast';

export default defineNuxtPlugin((nuxtApp) => {
  const { error: showError } = useToast();

  // ;>10;L=K9 >1@01>BG8: >H81>: Vue
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.error('Vue Error:', error);
    console.error('Error Info:', info);

    // >:07K205< ?>;L7>20B5;N C254><;5=85 >1 >H81:5
    if (error instanceof Error) {
      showError(error.message || '@>87>H;0 =5?@542845==0O >H81:0');
    }

    //  @568<5 @07@01>B:8 2K2>48< ?>4@>1=CN 8=D>@<0F8N
    if (process.env.NODE_ENV === 'development') {
      console.error('Component Instance:', instance);
    }

    // B?@02;O5< >H81:C 2 A8AB5<C <>=8B>@8=30 (=0?@8<5@, Sentry)
    // if (window.$sentry) {
    //   window.$sentry.captureException(error);
    // }
  };

  // 1@01>BG8: =5>1@01>B0==KE >B:;>=5=89 ?@><8A>2
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);

      // >:07K205< ?>;L7>20B5;N C254><;5=85
      if (event.reason?.message) {
        showError(event.reason.message);
      } else if (typeof event.reason === 'string') {
        showError(event.reason);
      } else {
        showError('@>87>H;0 =5?@542845==0O >H81:0');
      }

      // @54>B2@0I05< 45D>;B=>5 ?>2545=85 1@0C75@0
      event.preventDefault();
    });
  }

  // 5@5E20BK205< >H81:8 fetch
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args);

      // @>25@O5< AB0BCA >B25B0
      if (!response.ok) {
        // KB05<AO ?>;CG8BL A>>1I5=85 >1 >H81:5 87 >B25B0
        let errorMessage = `HTTP Error ${response.status}`;
        try {
          const errorData = await response.clone().json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // A;8 =5 C40;>AL @0A?0@A8BL JSON, 8A?>;L7C5< AB0BCA B5:AB
          errorMessage = response.statusText || errorMessage;
        }

        // !?5F80;L=0O >1@01>B:0 4;O @07;8G=KE :>4>2 >H81>:
        switch (response.status) {
          case 401:
            // 502B>@87>20= - ?5@5=0?@02;O5< =0 AB@0=8FC 2E>40
            showError('5>1E>48<0 02B>@870F8O');
            // navigateTo('/login');
            break;
          case 403:
            showError('>ABC? 70?@5I5=');
            break;
          case 404:
            showError('0?@0H8205<K9 @5AC@A =5 =0945=');
            break;
          case 500:
            showError('=CB@5==OO >H81:0 A5@25@0');
            break;
          case 503:
            showError('!5@28A 2@5<5==> =54>ABC?5=');
            break;
          default:
            showError(errorMessage);
        }
      }

      return response;
    } catch (error) {
      // 1@01>B:0 A5B52KE >H81>:
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        showError('H81:0 A>548=5=8O A A5@25@><. @>25@LB5 8=B5@=5B-A>548=5=85.');
      } else {
        console.error('Fetch Error:', error);
        showError('@>87>H;0 >H81:0 ?@8 2K?>;=5=88 70?@>A0');
      }
      throw error;
    }
  };

  // !>7405< 3;>10;L=K9 >1@01>BG8: 4;O API 70?@>A>2
  nuxtApp.provide('errorHandler', {
    handle: (error: any) => {
      console.error('API Error:', error);

      // 1@01>B:0 @07;8G=KE B8?>2 >H81>:
      if (error.response) {
        // H81:0 >B A5@25@0
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error;

        switch (status) {
          case 400:
            showError(message || '5:>@@5:B=K5 40==K5 70?@>A0');
            break;
          case 401:
            showError('5>1E>48<0 02B>@870F8O');
            // >6=> 4>1028BL @548@5:B =0 AB@0=8FC ;>38=0
            break;
          case 403:
            showError('# 20A =5B ?@02 4;O 2K?>;=5=8O MB>3> 459AB28O');
            break;
          case 404:
            showError('0?@0H8205<K9 @5AC@A =5 =0945=');
            break;
          case 422:
            // H81:8 20;840F88
            if (error.response.data?.errors) {
              const errors = error.response.data.errors;
              const errorMessages = Object.values(errors).flat().join(', ');
              showError(errorMessages);
            } else {
              showError(message || 'H81:0 20;840F88 40==KE');
            }
            break;
          case 500:
            showError('=CB@5==OO >H81:0 A5@25@0. >?@>1C9B5 ?>765.');
            break;
          case 503:
            showError('!5@28A 2@5<5==> =54>ABC?5=. >?@>1C9B5 ?>765.');
            break;
          default:
            showError(message || `H81:0 ${status}`);
        }
      } else if (error.request) {
        // 0?@>A 1K; >B?@02;5=, => >B25B =5 ?>;CG5=
        showError('!5@25@ =5 >B25G05B. @>25@LB5 A>548=5=85.');
      } else {
        // @C385 >H81:8
        showError(error.message || '@>87>H;0 =5?@542845==0O >H81:0');
      }
    },

    // 5B>4 4;O 157>?0A=>3> 2K?>;=5=8O 0A8=E@>==KE >?5@0F89
    async tryAsync<T>(fn: () => Promise<T>, fallback?: T): Promise<T | undefined> {
      try {
        return await fn();
      } catch (error) {
        this.handle(error);
        return fallback;
      }
    }
  });
});