/**
 * 3주차 다해 - 장기렌트 page에서 견적확인 시 캐피탈사별 견적 리스트를 보여주는 컴포넌트
 */

import React, { MouseEvent } from "react";
import "./Capital.css";

import { ICapitalList } from "../Rental";

interface ICapitalProps {
  totalPrice: number;
  capitalList: ICapitalList[];
  rentalPeriod: number;
  insurancePlan: number;
  deposit: number;
  advancePay: number;
  handleModal: (e: MouseEvent<HTMLInputElement>) => void;
}

export default class Capital extends React.Component<ICapitalProps> {
  constructor(props: ICapitalProps) {
    super(props);
  }

  public render() {
    const { totalPrice, capitalList, rentalPeriod, insurancePlan, deposit, advancePay } = this.props;

    return (
      <div className="capital-list">
        <div className="capital-list-head">
          <div>캐피탈사</div>
          <div>총 렌탈 금액</div>
          <div>월 렌탈료</div>
          <div>견적서 보기</div>
        </div>
        {capitalList
          .sort((a, b) => (a.capital_profit > b.capital_profit ? 1 : b.capital_profit > a.capital_profit ? -1 : 0))
          .map((capital) => {
            const finalRent = totalPrice * (1 + capital.capital_profit / 100) + insurancePlan;
            const monthlyRend = (finalRent - (finalRent * deposit + finalRent * advancePay)) / rentalPeriod;
            return (
              <div className="capital-list-content" key={capital.capital_name}>
                <div>{capital.capital_name}</div>
                <div>{`${finalRent.toLocaleString()}원`}</div>
                <div>{`${Math.floor(monthlyRend).toLocaleString()}원`}</div>
                <div>
                  <input
                    type="button"
                    value="보기"
                    data-capital={capital.capital_name}
                    data-profit={capital.capital_profit}
                    onClick={this.props.handleModal}
                  />
                </div>
              </div>
            );
          })}
      </div>
    );
  }
}
