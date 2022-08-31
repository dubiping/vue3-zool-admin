import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

/**  字符长度 检验*/
export const getLengthValidator = () => {
  const validUpper = (_rule, value, _callback) => {
    if (value) {
      const lengthReg = value.replace(/[^\x00-\xff]/g, '');
      if (lengthReg.length > 100) {
        return Promise.reject(t('validator.charError'));
      } else {
        return Promise.resolve();
      }
    } else {
      return Promise.resolve();
    }
  };
  return validUpper;
};
/** 大写字母  */
export const getUppercaseValidator = () => {
  const isUppercase = /^[A-Z]+$/;
  const validUpper = (_rule, value, _callback) => {
    if (!value) {
      return Promise.reject(t('validator.upper'));
    } else if (!isUppercase.test(value)) {
      return Promise.reject(t('validator.upperError'));
    } else {
      return Promise.resolve();
    }
  };
  return validUpper;
};

/**
 * 
 * @param rule 
 *  max: 0,
    mim: 6,
    pwdHasChar: 1,
    pwdHasNum: 1,
    pwdHasSpecial: 1,
    pwdHasUpper: 1,
    pwdSpecialChar: '#',
    pwdDescList: [
      '长度为6~20个字符 ↵',
      '只能包含数字、字母',
      '至少一个数字、一个大写字母'
    ]
 * @param str 
 * @returns 
 */
export const generateRule = (rule: any, str: string) => {
  const hasSpecial = !!rule.pwdHasSpecial && rule.pwdSpecialChar;
  rule.mim = rule.mim < 0 ? 0 : rule.mim;
  const ruleMap = [
    {
      condition: true,
      value: rule.max
        ? `^[a-zA-Z0-9${hasSpecial ? rule.pwdSpecialChar : ''}]{${rule.mim},${rule.max}}$`
        : `^[a-zA-Z0-9${hasSpecial ? rule.pwdSpecialChar : ''}]{${rule.mim},}$`,
    },
    {
      // 至少一个数字
      condition: !!rule.pwdHasNum,
      value: '[0-9]+',
    },
    {
      // 至少一个字母
      condition: !!rule.pwdHasChar,
      value: '[a-zA-Z]+',
    },
    {
      // 至少一个大写字母
      condition: !!rule.pwdHasUpper,
      value: '[A-Z]+',
    },
    {
      // 特殊字符
      condition: hasSpecial,
      value: `[a-zA-Z0-9${hasSpecial ? rule.pwdSpecialChar : ''}]+`,
    },
  ];
  return ruleMap.every((v) => {
    if (v.condition) {
      // console.log(v.value, new RegExp(v.value, 'g').test(str));
      return new RegExp(v.value, 'g').test(str);
    }
    return true;
  });
};

export const getPwdValidator = (rule: any, defaultTip) => {
  const validPwd = (_rule, value, _callback) => {
    if (!value) {
      return Promise.reject(defaultTip);
    } else if (!generateRule(rule, value)) {
      return Promise.reject(rule?.pwdDescList?.join(',') || '');
    } else {
      return Promise.resolve();
    }
  };
  return validPwd;
};

// 手机规则校验器
export const getMobileValidator = () => {
  const isMobile = /^1[3|4|5|7|8][0-9]\d{8}$/;
  const validMobile = (_rule, value, callback) => {
    if (!value) {
      callback(new Error(t('validator.mobile')));
    } else if (!isMobile.test(value)) {
      callback(new Error(t('validator.mobileError')));
    } else {
      callback();
    }
  };
  return validMobile;
};

//邮箱规则校验器
export const getEmailValidator = () => {
  const isEmail =
    /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
  const validEmail = (_rule, value, callback) => {
    if (!value) {
      callback(new Error(t('validator.email')));
    } else if (!isEmail.test(value)) {
      callback(new Error(t('validator.emailError')));
    } else {
      callback();
    }
  };
  return validEmail;
};
