import React from "react";
import SliderBlogWrapper from "./sliderblog.style";
import Button from "components/button/Button";
import classNames from "classnames";
import { Slide } from "react-slideshow-image";

const properties = {
  duration: 3000,
  transitionDuration: 500,
  infinite: true,
  indicators: true,
  arrows: true,
  onChange: (oldIndex, newIndex) => {
    console.log(`slide transition from ${oldIndex} to ${newIndex}`);
  }
};

const SliderBlog = props => {
  const { banners, title, created, info, like, comment, className } = props;
  return (
    <SliderBlogWrapper>
      <div className={classNames("roe-card-style", className)}>
        <div className="roe-card-body pt-24 backImage">
          <div>
            <div className="slide-container">
              <Slide {...properties}>
                {banners &&
                  banners.map((a, i) => {
                    return (
                      <div className="each-slide" key={i}>
                        <div className="blog-cover">
                          <img src={a} alt="blog" />
                        </div>
                      </div>
                    );
                  })}
              </Slide>
            </div>
            <div className="fs-20 bold-text widget-dark-color mtb-10">
              {title}
            </div>
            <div className="fs-14 medium-text mb-10 widget-grey-color">
              {created}
            </div>
            <div className="fs-15 medium-text widget-light-grey-color">
              {info}
            </div>
            <div className="flex-x align-center mt-10">
              <div className="flex-1">
                <Button className="c-btn c-info">READ MORE</Button>
              </div>
              <div className="mr-10">
                <i className="fas fa-share-alt fs-16 cursor-pointer widget-grey-color"></i>
              </div>
              <div>
                <i className="far fa-heart fs-16 cursor-pointer widget-grey-color"></i>
              </div>
              <div className="fs-16 demi-bold-text mr-10 ml-6 widget-light-grey-color">
                {like}
              </div>
              <div>
                <i className="far fa-comment-alt fs-16 cursor-pointer widget-grey-color"></i>
              </div>
              <div className="fs-16 demi-bold-text ml-6 widget-light-grey-color">
                {comment}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SliderBlogWrapper>
  );
};

export default SliderBlog;
