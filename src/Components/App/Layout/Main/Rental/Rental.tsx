import "./Rental.css";

import React, { Component, MouseEvent, FormEvent, ChangeEvent } from "react";
import axios from "axios";

import Origin from "./Origin/Origin";
import Capital from "./Capital/Capital";
import Modal from "./Modal/Modal";

interface IBrand {
  car_brand: string;
}

interface ISeries {
  car_series: string;
}

interface IModel {
  car_model: string;
}

interface IDetail {
  car_detail: string;
}

interface IGrade {
  car_grade: string;
}

interface IOption {
  car_option: string;
  car_option_price: number;
}

interface IRentalProps {
  isSidebarOpen: boolean;
}

export interface ICapitalList {
  capital_id: number;
  capital_name: string;
  capital_profit: number;
}

export interface IRentalStates {
  origin: string;

  brand: string;
  brandList: IBrand[];

  series: string;
  seriesList: ISeries[];

  model: string;
  modelList: IModel[];

  detail: string;
  detailList: IDetail[];

  grade: string;
  gradeList: IGrade[];

  option: string;
  optionList: IOption[];

  price: number;
  optionPrice: number;
  totalPrice: number;

  rentalPeriod: number;
  insurancePlan: number;
  deposit: number;
  advancePay: number;

  capitalList: ICapitalList[];
  capital: string;
  profit: number;

  checkedBrand: string;
  checkedSeries: string;
  checkedModel: string;
  checkedDetail: string;
  checkedGrade: string;
  checkedOption: string;

  listClicked: boolean;
  detailClicked: boolean;

  [key: string]:
    | string
    | number
    | boolean
    | ICapitalList[]
    | IBrand[]
    | ISeries[]
    | IModel[]
    | IDetail[]
    | IGrade[]
    | IOption[];
}

interface ISelectMessages {
  [key: string]: string;
}

const selectMessages: ISelectMessages = {
  none: "정보없음",
  series: "제조사를 선택해주세요.",
  model: "시리즈를 선택해주세요.",
  detail: "모델을 선택해주세요.",
  grade: "상세모델을 선택해주세요.",
  option: "등급을 선택해주세요."
};

function isInvaildItem(item: string): boolean {
  for (const msg in selectMessages) {
    if (item === selectMessages[msg]) {
      return true;
    }
  }

  return false;
}

export default class Rental extends Component<IRentalProps, IRentalStates> {
  constructor(props: IRentalProps) {
    super(props);

    this.state = {
      origin: "korea",

      brand: "",
      brandList: [{ car_brand: "" }],

      series: "",
      seriesList: [{ car_series: selectMessages.series }],

      model: "",
      modelList: [{ car_model: selectMessages.model }],

      detail: "",
      detailList: [{ car_detail: selectMessages.detail }],

      grade: "",
      gradeList: [{ car_grade: selectMessages.grade }],

      option: "",
      optionList: [{ car_option: selectMessages.option, car_option_price: 0 }],

      price: 0,
      optionPrice: 0,
      totalPrice: 0,

      rentalPeriod: 0,
      insurancePlan: 0,
      deposit: 0,
      advancePay: 0,

      capitalList: [],
      capital: "",
      profit: 0,

      checkedBrand: "",
      checkedSeries: "",
      checkedModel: "",
      checkedDetail: "",
      checkedGrade: "",
      checkedOption: "",

      listClicked: false,
      detailClicked: false
    };

    this.handleOriginClick = this.handleOriginClick.bind(this);
    this.handleBrandClick = this.handleBrandClick.bind(this);
    this.handleSeriesClick = this.handleSeriesClick.bind(this);
    this.handleModelClick = this.handleModelClick.bind(this);
    this.handleDetailClick = this.handleDetailClick.bind(this);
    this.handleGradeClick = this.handleGradeClick.bind(this);
    this.handleOptionClick = this.handleOptionClick.bind(this);

    this.handleEstimate = this.handleEstimate.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleCheck(e: FormEvent<HTMLInputElement>) {
    const { name, value } = e.currentTarget;
    this.setState({ [name]: value });
  }

  handleSelect(e: ChangeEvent<HTMLSelectElement>) {
    const { id, value } = e.currentTarget;
    const numericValue = Number(value);
    this.setState({ [id]: numericValue });
  }

  handleModal(e: MouseEvent<HTMLInputElement>) {
    const capital = e.currentTarget.dataset.capital as string;
    const profit = Number(e.currentTarget.dataset.profit);
    this.setState({ detailClicked: true, capital, profit });
  }

  handleSave() {
    const body: object = {
      origin: this.state.origin,
      brand: this.state.brand,
      series: this.state.series,
      model: this.state.model,
      detail: this.state.detail,
      grade: this.state.grade,
      option: this.state.option,

      carPrice: this.state.price,
      carOptionPrice: this.state.optionPrice,

      capital: this.state.capital,
      finalPrice: this.state.totalPrice * (1 + this.state.profit / 100) + this.state.insurancePlan,

      rentalPeriod: this.state.rentalPeriod,
      insurancePlan: this.state.insurancePlan,
      deposit: this.state.deposit,
      advancePay: this.state.advancePay
    };

    const config: object = {
      headers: { "x-access-token": localStorage.getItem("x-access-token") }
    };

    axios.post(`${process.env.REACT_APP_API_URL}/api/rental/estimate`, body, config).then((res) => {
      console.log(res);
      this.setState({ detailClicked: false });
    });
  }

  handleOriginClick(origin: string) {
    this.setState({ listClicked: false });

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/rental/${origin}`)
      .then((res) => {
        const brandList: IBrand[] = res.data.brandList;
        this.setState({
          brandList,
          origin,
          seriesList: [{ car_series: selectMessages.series }],
          modelList: [{ car_model: selectMessages.model }],
          detailList: [{ car_detail: selectMessages.detail }],
          gradeList: [{ car_grade: selectMessages.grade }],
          optionList: [{ car_option: selectMessages.option, car_option_price: 0 }],
          price: 0
        });
      })
      .catch((err: Error) => {
        alert(err.message);
      });
  }

  handleBrandClick(e: MouseEvent) {
    this.setState({ listClicked: false });

    const brand = e.currentTarget.textContent || selectMessages.none;
    if (isInvaildItem(brand)) {
      return;
    }

    const origin = this.state.origin;
    const encodedBrand = encodeURI(brand);

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/rental/${origin}/${encodedBrand}`)
      .then((res) => {
        const seriesList: ISeries[] = res.data.seriesList;
        this.setState({
          seriesList,
          brand,
          modelList: [{ car_model: selectMessages.model }],
          detailList: [{ car_detail: selectMessages.detail }],
          gradeList: [{ car_grade: selectMessages.grade }],
          optionList: [{ car_option: selectMessages.option, car_option_price: 0 }],
          price: 0
        });
      })
      .catch((err: Error) => {
        alert(err.message);
      });
  }

  handleSeriesClick(e: MouseEvent) {
    this.setState({ listClicked: false });

    const series = e.currentTarget.textContent || selectMessages.none;
    if (isInvaildItem(series)) {
      return;
    }

    const origin = this.state.origin;
    const brand = this.state.brand;

    const encodedBrand = encodeURI(brand);
    const encodedSeries = encodeURI(series);

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/rental/${origin}/${encodedBrand}/${encodedSeries}`)
      .then((res) => {
        const modelList: IModel[] = res.data.modelList;
        this.setState({
          modelList,
          series,
          detailList: [{ car_detail: selectMessages.detail }],
          gradeList: [{ car_grade: selectMessages.grade }],
          optionList: [{ car_option: selectMessages.option, car_option_price: 0 }],
          price: 0
        });
      })
      .catch((err: Error) => {
        alert(err.message);
      });
  }

  handleModelClick(e: MouseEvent) {
    this.setState({ listClicked: false });

    const model = e.currentTarget.textContent || selectMessages.none;
    if (isInvaildItem(model)) {
      return;
    }

    const origin = this.state.origin;
    const brand = this.state.brand;
    const series = this.state.series;

    const encodedBrand = encodeURI(brand);
    const encodedSeries = encodeURI(series);
    const encodedModel = encodeURI(model);

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/rental/${origin}/${encodedBrand}/${encodedSeries}/${encodedModel}`)
      .then((res) => {
        const detailList: IDetail[] = res.data.detailList;
        this.setState({
          detailList,
          model,
          gradeList: [{ car_grade: selectMessages.grade }],
          optionList: [{ car_option: selectMessages.option, car_option_price: 0 }],
          price: 0
        });
      })
      .catch((err: Error) => {
        alert(err.message);
      });
  }

  handleDetailClick(e: MouseEvent) {
    this.setState({ listClicked: false });

    const detail = e.currentTarget.textContent || selectMessages.none;
    if (isInvaildItem(detail)) {
      return;
    }

    const origin = this.state.origin;
    const brand = this.state.brand;
    const series = this.state.series;
    const model = this.state.model;

    const encodedBrand = encodeURI(brand);
    const encodedSeries = encodeURI(series);
    const encodedModel = encodeURI(model);
    const encodedDetail = encodeURI(detail);

    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }/api/rental/${origin}/${encodedBrand}/${encodedSeries}/${encodedModel}/${encodedDetail}`
      )
      .then((res) => {
        const gradeList: IGrade[] = res.data.gradeList;
        this.setState({
          gradeList,
          detail,
          optionList: [{ car_option: selectMessages.option, car_option_price: 0 }],
          price: 0
        });
      })
      .catch((err: Error) => {
        alert(err.message);
      });
  }

  handleGradeClick(e: MouseEvent) {
    this.setState({ listClicked: false });

    const grade = e.currentTarget.textContent || selectMessages.none;
    if (isInvaildItem(grade)) {
      return;
    }

    const origin = this.state.origin;
    const brand = this.state.brand;
    const series = this.state.series;
    const model = this.state.model;
    const detail = this.state.detail;

    const encodedBrand = encodeURI(brand);
    const encodedSeries = encodeURI(series);
    const encodedModel = encodeURI(model);
    const encodedDetail = encodeURI(detail);
    const encodedGrade = encodeURI(grade);

    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }/api/rental/${origin}/${encodedBrand}/${encodedSeries}/${encodedModel}/${encodedDetail}/${encodedGrade}`
      )
      .then((res) => {
        const price = res.data.car_price;
        const optionList: IOption[] = res.data.optionList;
        this.setState({ optionList, grade, price });
      })
      .catch((err: Error) => {
        alert(err.message);
      });
  }

  handleOptionClick(e: MouseEvent) {
    this.setState({ listClicked: false });

    const option = e.currentTarget.children[1].children[0].textContent || selectMessages.none;
    const optionInfo = this.state.optionList.reduce(
      (accu, curr) => {
        return curr.car_option === option ? curr : accu;
      },
      {
        car_option: selectMessages.none,
        car_option_price: 0
      }
    );

    const optionPrice = optionInfo.car_option_price;

    if (isInvaildItem(option)) {
      return;
    }

    this.setState({ option, optionPrice, totalPrice: this.state.price + optionPrice });
  }

  handleEstimate(e: MouseEvent) {
    const { price, rentalPeriod, insurancePlan } = this.state;
    if (price === 0 || rentalPeriod === 0 || insurancePlan === 0) {
      return alert("차량 및 조건 선택 후 견적 확인이 가능합니다.");
    }

    this.setState({ listClicked: true });

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/rental/capital-profit`)
      .then((res) => {
        this.setState({ capitalList: res.data.capitalList });
      })
      .catch((err) => alert(err.message));
  }

  componentDidMount() {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/rental/korea`)
      .then((res) => {
        const brandList: IBrand[] = res.data.brandList;
        this.setState({ brandList });
      })
      .catch((err: Error) => {
        alert(err.message);
      });

    const modal = document.getElementById("my-modal") as HTMLElement;
    window.onclick = (e) => {
      if (e.target === modal) {
        this.setState({ detailClicked: false });
      }
    };
  }

  render() {
    const {
      price,
      optionPrice,
      totalPrice,
      capitalList,
      rentalPeriod,
      insurancePlan,
      deposit,
      advancePay,
      listClicked,
      detailClicked
    } = this.state;

    return (
      <div id="my-main" className={this.props.isSidebarOpen ? "" : "my-main-margin-left"}>
        <div className="select_car">
          <h1>
            <i className="fa fa-cab" />
            장기렌트
          </h1>
          <div className="item_lists">
            <div className="item_list">
              <div className="item_lists_title">
                <div className="item_list_title">
                  <div className="item_list_title">제조사</div>
                </div>
                <Origin handleOriginClick={this.handleOriginClick} />
              </div>
              <ul className="list_group">
                {this.state.brandList.map((v) => (
                  <li className="list-group-item" onClick={this.handleBrandClick} key={v.car_brand}>
                    <input
                      type="radio"
                      name="checkedBrand"
                      id={v.car_brand}
                      value={v.car_brand}
                      checked={this.state.checkedBrand === v.car_brand}
                      onChange={this.handleCheck}
                    />
                    <label htmlFor={v.car_brand}>{v.car_brand}</label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="item_list">
              <div className="item_lists_title">
                <div className="item_list_title">시리즈</div>
              </div>
              <ul className="list_group">
                {this.state.seriesList.map((v) => (
                  <li className="list-group-item" onClick={this.handleSeriesClick} key={v.car_series}>
                    <input
                      type="radio"
                      name="checkedSeries"
                      id={v.car_series}
                      value={v.car_series}
                      checked={this.state.checkedSeries === v.car_series}
                      onChange={this.handleCheck}
                    />
                    <label htmlFor={v.car_series}>{v.car_series}</label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="item_list">
              <div className="item_lists_title">
                <div className="item_list_title">모델명</div>
              </div>
              <ul className="list_group">
                {this.state.modelList.map((v) => (
                  <li className="list-group-item" onClick={this.handleModelClick} key={v.car_model}>
                    <input
                      type="radio"
                      name="checkedModel"
                      id={v.car_model}
                      value={v.car_model}
                      checked={this.state.checkedModel === v.car_model}
                      onChange={this.handleCheck}
                    />
                    <label htmlFor={v.car_model}>{v.car_model}</label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="item_list">
              <div className="item_lists_title">
                <div className="item_list_title">상세모델</div>
              </div>
              <ul className="list_group">
                {this.state.detailList.map((v) => (
                  <li className="list-group-item" onClick={this.handleDetailClick} key={v.car_detail}>
                    <input
                      type="radio"
                      name="checkedDetail"
                      id={v.car_detail}
                      value={v.car_detail}
                      checked={this.state.checkedDetail === v.car_detail}
                      onChange={this.handleCheck}
                    />
                    <label htmlFor={v.car_detail}>{v.car_detail}</label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="item_list">
              <div className="item_lists_title">
                <div className="item_list_title">등급</div>
              </div>
              <ul className="list_group">
                {this.state.gradeList.map((v) => (
                  <li className="list-group-item" onClick={this.handleGradeClick} key={v.car_grade}>
                    <input
                      type="radio"
                      name="checkedGrade"
                      id={v.car_grade}
                      value={v.car_grade}
                      checked={this.state.checkedGrade === v.car_grade}
                      onChange={this.handleCheck}
                    />
                    <label htmlFor={v.car_grade}>{v.car_grade}</label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="option_and_price">
            <div className="option">
              <div className="item_lists_title">
                <div className="item_list_title">옵션</div>
              </div>
              <ul className="list_group">
                {this.state.optionList.map((v) => (
                  <li
                    className="list-group-item apply_display_flex_sb"
                    onClick={this.handleOptionClick}
                    key={v.car_option}
                  >
                    <input
                      type="radio"
                      name="checkedOption"
                      id={v.car_option}
                      value={v.car_option}
                      checked={this.state.checkedOption === v.car_option}
                      onChange={this.handleCheck}
                    />
                    <label htmlFor={v.car_option}>
                      <span>{v.car_option}</span>
                      <span>{`${v.car_option_price.toLocaleString()}원`}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rent-condition">
              <div className="item_lists_title">
                <div className="item_list_title">렌탈조건</div>
              </div>
              <ul className="list_group">
                <li className="list-group-item apply_display_flex_sb">
                  <label htmlFor="rentalPeriod">렌탈기간</label>
                  <select id="rentalPeriod" value={this.state.rentalPeriod} onChange={this.handleSelect} required>
                    <option hidden>선택</option>
                    <option value="12">12개월</option>
                    <option value="24">24개월</option>
                    <option value="36">36개월</option>
                    <option value="48">48개월</option>
                    <option value="60">60개월</option>
                  </select>
                </li>
                <li className="list-group-item apply_display_flex_sb">
                  <label htmlFor="insurancePlan">보험담보</label>
                  <select id="insurancePlan" value={this.state.insurancePlan} onChange={this.handleSelect} required>
                    <option hidden>선택</option>
                    <option value="1000000">21세 이상</option>
                    <option value="600000">26세 이상</option>
                  </select>
                </li>
                <li className="list-group-item apply_display_flex_sb">
                  <label htmlFor="deposit">보증금</label>
                  <select id="deposit" value={this.state.deposit} onChange={this.handleSelect} required>
                    <option hidden>선택</option>
                    <option value="0">0%</option>
                    <option value="0.1">10%</option>
                    <option value="0.2">20%</option>
                    <option value="0.3">30%</option>
                  </select>
                </li>
                <li className="list-group-item apply_display_flex_sb">
                  <label htmlFor="advancePay">선납금</label>
                  <select id="advancePay" value={this.state.advancePay} onChange={this.handleSelect} required>
                    <option hidden>선택</option>
                    <option value="0">0%</option>
                    <option value="0.1">10%</option>
                    <option value="0.2">20%</option>
                    <option value="0.3">30%</option>
                  </select>
                </li>
              </ul>
            </div>

            <div className="price">
              <div>
                차량가격 : <span>{`${price.toLocaleString()}원`}</span>
              </div>
              <div>
                옵션가격 : <span>{`${optionPrice.toLocaleString()}원`}</span>
              </div>
              <hr />
              <div>
                합 계 : <span>{`${totalPrice.toLocaleString()}원`}</span>
              </div>
            </div>
          </div>

          <div className="btn-container">
            <input type="button" value="견적 확인" disabled={listClicked} onClick={this.handleEstimate} />
          </div>

          <div className={"capital-list-container " + (listClicked ? "" : "display-none")}>
            <Capital
              totalPrice={totalPrice}
              capitalList={capitalList}
              rentalPeriod={rentalPeriod}
              insurancePlan={insurancePlan}
              deposit={deposit}
              advancePay={advancePay}
              handleModal={this.handleModal}
            />
          </div>

          <div id="my-modal" className={detailClicked ? "show-my-modal" : "display-none"}>
            <Modal handleSave={this.handleSave} rentalData={this.state} />
          </div>
        </div>
      </div>
    );
  }
}
