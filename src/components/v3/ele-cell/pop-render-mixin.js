/*jshint esversion:6 */
import { urlRedirect } from '../../../../api/Utils';

export const pop = {
  created() {

  },
  data() {
    return {
    };
  },
  computed: {
    resolvePop() {
      const currentVal = this.field.extendParams || null,
        element = {}
      if(!currentVal) {
        element.type = 'span'
        element.define = {}
        return element
      }
      var link = currentVal.detailLinkUrl,
        dynamicTitle = currentVal.detailTitle,
        title = currentVal.detailTitle1,
        urlAvailable = true

      currentVal.detailLink.forEach(element => {
        if(this.domainObject[element.params] == undefined) {
          urlAvailable = false
        }
        link += `&${element.key}=${this.domainObject[element.params]}`
      });
      // if(dynamicTitle) {
      //   title = `${this.domainObject[dynamicTitle]}${title}`
      // }
      if(!urlAvailable) {
        element.type = 'span'
        element.define = {}
        return element
      }
      element.type = 'a'
      element.define = {
        attrs: {
          'data-link': link,
          name: title,
          href: 'javascript:;'
        },
        'class': {
          blue: true,
        },
        on: {
          click: () => {
            this.openWindow(link, title)
          }
        }
      }

      return element
    }
  },
  methods:{

    openWindow(url, title) {
      urlRedirect(url, title);
    }

  }
}
