import { Card, Col, Empty, Row, Typography } from "antd";
import React from "react";
import { useHistory } from "react-router-dom";
import { _isEmpty } from "../../../../utils";
import {


  CardHeader,

} from "reactstrap"
const { Title } = Typography;
const CardUnit = ({ title, data }) => {
  const history = useHistory();
  return (
    <Card className="card-data">
      <CardHeader style={{ backgroundColor: '#634ae2' }}>
                <h3 className="mb-0 text-white ">ยูนิต</h3>
              </CardHeader>
      {_isEmpty(data) ? (
        <Empty />
      ) : (
        data?.map((item) => (
          <div
            className="card-list"
            onClick={() => {
              localStorage.setItem("propertyid", String(item.propertyId));
              console.log("(item.propertyId",item)
              history.push(`/properties/${item.propertyId}/unit/update/${item.unitId}`);
            }}
          >
            <Row gutter={24} align="middle">
              <Col style={{ marginTop: "8px" }}>
                <Title level={5}>{item.unitName}</Title>
              </Col>
            </Row>
          </div>
        ))
      )}
    </Card>
  );
};
export default CardUnit;
