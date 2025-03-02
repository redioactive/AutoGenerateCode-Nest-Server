import {Faker,LocaleDefinition,base,en,de} from "@faker-js/faker";

//自定义 locale 配置

const customLocal:LocaleDefinition = {
    internet:{
        domainSuffix:['test']
    },
    lorem:{
        word:['customWord'],
        words:(count:number) => 'custom' .repeat(count).trim()
    }
}

//创建自定义Faker实例
export const customFaker = new Faker({
    locale:[customLocal,en,de,base]
})