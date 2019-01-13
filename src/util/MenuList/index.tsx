export interface IMenus {
  icon: string;
  content: string;
  path: string;
}

interface IGetMenus {
  (signedInLevel: number): IMenus[];
}

const guestUserMenu = [
  { icon: "home", content: "홈으로 가기", path: "/" },
  { icon: "cab", content: "장기렌트", path: "/rental" },
];

const nomalUserMenu = [...guestUserMenu, { icon: "calculator", content: "견적내역보기", path: "/estimate_list" }];

const capitalUserMenu = [...nomalUserMenu, { icon: "television", content: "견적서보기(임시)", path: "/estimate_form" }];

const superUserMenu = [
  ...capitalUserMenu,
  { icon: "television", content: "회원정보관리", path: "/admin/user_information_management" },
];

export const getMenus: IGetMenus = (signedInLevel) => {
  const isGuestUser = signedInLevel === 0;
  if (isGuestUser) {
    return guestUserMenu;
  }

  const isNomalUser = signedInLevel < 2;
  if (isNomalUser) {
    return nomalUserMenu;
  }

  const isCapitalUser = signedInLevel === 5;
  if (isCapitalUser) {
    return capitalUserMenu;
  }

  const isSuperUser = signedInLevel === 10;
  if (isSuperUser) {
    return superUserMenu;
  }

  return [];
};
