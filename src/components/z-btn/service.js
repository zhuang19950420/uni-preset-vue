import api from '../../api/service/index'

// 获取手机号
export const decryptUserMobile = (code) => {
    return api.decryptUserMobile({
        data: {code},
    })
}

// 获取头像
export const saveCustomerProfile = (data={}) =>{
    return api.saveCustomerProfile({
        data: data,
    })
}