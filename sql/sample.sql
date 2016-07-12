create table user_info (
    user_id varchar(255) NOT NULL,
    account varchar(255) NOT NULL,
    passwd varchar(255) NOT NULL,
    PRIMARY KEY(user_id)
) ENGINE=innoDB DEFAULT CHARSET=utf8;

create table user_data (
    user_id varchar(255) NOT NULL,
    commodity_id int NOT NULL DEFAULT 0,
    weight int NOT NULL DEFAULT 0,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    flag ENUM('on','off') DEFAULT 'off',
    PRIMARY KEY(user_id,commodity_id)
) ENGINE=innoDB DEFAULT CHARSET=utf8;

create table commodity_data (
    commodity_id int NOT NULL,
    commodity_name varchar(255) NOT NULL,
    limit_weight int NOT NULL DEFAULT 0,
    PRIMARY KEY(commodity_id)
) ENGINE=innoDB DEFAULT CHARSET=utf8;
