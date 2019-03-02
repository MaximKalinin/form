import React, { Component } from 'react';
import axios from 'axios';

import spring from '../../assets/spring.jpg';
import summer from '../../assets/summer.jpg';
import fall from '../../assets/fall.jpg';
import winter from '../../assets/winter.jpg';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import ImageGrid from '../../components/ImageGrid/ImageGrid';
import Spinner from '../../components/Spinner/Spinner';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import './Form.css';

class Form extends Component {
    state = {
        stage: 0,
        valid: false,
        animateForm: false,
        loading: false,
        token: null,
        userId: null,
        error: false,
        errorMessage: 'Что-то пошло не так... Попробуйте перезагрузить страницу',
        fields: [
            {
                type: 'email',
                value: '',
                hint: 'Это не похоже на E-mail...',
                valid: false,
                touched: false,
                label: 'Ваш E-mail',
                stage: 0,
                id: 'email',
                rules: {
                    required: true,
                    isEmail: true
                }
            },
            {
                type: 'password',
                value: '',
                hint: 'Минимум 6 символов',
                valid: false,
                touched: false,
                stage: 0,
                label: 'Пароль',
                rules: {
                    required: true,
                    minimum: 6
                }
            },
            {
                type: 'text',
                value: '',
                hint: '',
                valid: false,
                touched: false,
                stage: 1,
                id: 'name',
                label: 'Ваше имя',
                rules: {
                    required: true
                }
            },
            {
                type: 'select',
                value: 'мужской',
                hint: '',
                valid: true,
                touched: true,
                stage: 1,
                id: 'gender',
                label: 'Ваш пол',
                rules: {
                    required: true
                },
                options: ['мужской', 'женский']
            }
        ],
        images : [
            {
                selected: false,
                src: summer,
                name: 'summer'
            },
            {
                selected: false,
                src: fall,
                name: 'fall'
            },
            {
                selected: false,
                src: winter,
                name: 'winter'
            },
            {
                selected: false,
                src: spring,
                name: 'spring'
            },
        ]
    };

    signupHandler = () => {
        if (this.state.valid) {
            this.setState({loading: true});
            const data = {
                email: this.state.fields.find(field => field.type === 'email').value,
                password: this.state.fields.find(field => field.type === 'password').value,
                returnSecureToken: true
            };
            axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyBRDKmG45aKAPtbwaYH7vrGLgcwJ3MAJfM', data)
            .then(res => {
                this.setState({loading: false, token: res.data.idToken, userId: res.data.localId});
                this.nextStage(1);
            })
            .catch(err => {
                this.setState({loading: false, error: true});
            });
        }
    }

    loginHandler = () => {
        if (this.state.valid) {
            this.setState({loading: true});
            const data = {
                email: this.state.fields.find(field => field.type === 'email').value,
                password: this.state.fields.find(field => field.type === 'password').value,
                returnSecureToken: true
            };
            axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBRDKmG45aKAPtbwaYH7vrGLgcwJ3MAJfM', data)
            .then(res => {
                this.setState({loading: false, token: res.data.idToken, userId: res.data.localId});
                this.nextStage(3);
            })
            .catch(err => {
                this.setState({loading: false, error: true});
            });
        }
    }

    inputHandler = (event, label) => {
        const fields = [...this.state.fields];
        const field = fields.find(field => (field.label === label));
        field.value = event.target.value;

        field.touched = true;
        field.valid = this.isValid(field.value, field.rules);

        let stageValid = true;
        fields.filter(field => (field.stage === this.state.stage))
        .forEach(field => {
            stageValid = stageValid && field.valid;
        });

        this.setState({fields: fields, valid: stageValid});
    }

    imageClickHandler = (name) => {
        const images = [...this.state.images];
        const clickedImage = images.find(image => (image.name === name));
        clickedImage.selected = !clickedImage.selected;
        let valid = false;
        images.forEach(image => {
            valid = valid || image.selected;
        })
        this.setState({images: images, valid: valid});
    }

    isValid = (value, rules) => {
        let valid = true;
        if (rules.required) {
            valid = valid && (value !== '');
        }
        if (rules.isEmail) {
            // const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            const pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            valid = valid && pattern.test(value);
        }
        if (rules.minimum) {
            valid = valid && value.length >= rules.minimum;
        }
        return valid;
    }

    nextStage = (diff) => {
        if (this.state.valid) {
            const stage = this.state.stage + diff;
            // console.log(stage);
            this.setState({stage: stage, animateForm: true, valid: false});
            setTimeout(() => {
                this.setState({animateForm: false});
            }, 1000);
            if (stage === 3) this.fetchData();
        }
    }

    fetchData = () => {
        this.setState({loading: true});
        const queryParams = '?auth=' + this.state.token + '&orderBy="userId"&equalTo="' + this.state.userId + '"';
        axios.get('https://form-47033.firebaseio.com/users.json' + queryParams)
        .then(response => {
            let data = {};
            for (let key in response.data) {
                data = {...response.data[key]};
            }
            console.log(data);
            const fields = [...this.state.fields];
            console.log(fields);
            data.fields.forEach(newField => {
                const oldField = fields.find(field => field.id === newField.id);
                oldField.value = newField.value;
                oldField.valid = true;
            });
            console.log(fields);
            this.setState({fields: fields, images: data.images, loading: false});
        })
        .catch(err => this.setState({loading: false, error: true}));
    }

    sendData = () => {
        if (this.state.valid) {
            this.setState({loading: true});
            const data = {
                userId: this.state.userId,
                fields: this.state.fields.filter(field => field.valid && field.id)
                .map(field => {return {id: field.id, value: field.value}}),
                images: this.state.images.filter(image => image.selected),
            };
            axios.post('https://form-47033.firebaseio.com/users.json?auth=' + this.state.token, data)
            .then(res => {
                this.nextStage(1);
                this.setState({loading: false});
                this.fetchData();
            })
            .catch(err => {
                this.setState({loading: false, error: true})
            });
        }
    }

    // skipStages = () => {
    //     const stage = 3;
    //     // console.log(stage);
    //     this.setState({stage: stage, animateForm: true, valid: false});
    //     setTimeout(() => {
    //         this.setState({animateForm: false});
    //     }, 1000);
    //     this.fetchData();
    // }

    render() {
        const formClasses = ['Form'];
        if (this.state.animateForm) formClasses.push('appear');

        let output = null;
        if (this.state.stage === 0) 
        output = 
        <div className={formClasses.join(' ')}>
            <ProgressBar stage={this.state.stage} />
            <h1>Давайте знакомиться!</h1>
            {this.state.fields.filter(field => (field.stage === this.state.stage))
            .map(field => {
                return (<Input
                    key={field.type} 
                    label={field.label} 
                    hint={field.hint} 
                    type={field.type} 
                    value={field.value} 
                    onChange={(event) => this.inputHandler(event, field.label)}
                    valid={field.valid}
                    touched={field.touched}
                    options={field.options} />);
            })}
            <Button label="Войти" onClick={this.loginHandler} />
            <Button label="Регистрация" full={this.state.valid} onClick={this.signupHandler} />
        </div>
        ;
        else if (this.state.stage === 1)
        output =
        <div className={formClasses.join(' ')}>
            <ProgressBar stage={this.state.stage} />
            <h1>Расскажите о себе</h1>
            {this.state.fields.filter(field => (field.stage === this.state.stage))
            .map(field => {
                return (<Input
                    key={field.type} 
                    label={field.label} 
                    hint={field.hint} 
                    type={field.type} 
                    value={field.value} 
                    onChange={(event) => this.inputHandler(event, field.label)}
                    valid={field.valid}
                    touched={field.touched}
                    options={field.options} />);
            })}
            <Button label="Далее" full={this.state.valid} onClick={() => this.nextStage(1)} />
        </div>
        ;
        else if (this.state.stage === 2)
        output = 
        <div className={formClasses.join(' ')}>
            <ProgressBar stage={this.state.stage} />
            <h1>Выберите темы для отслеживания</h1>
            <ImageGrid images={this.state.images} onImageClick={this.imageClickHandler} />
            <Button label="Закончить" full={this.state.valid} onClick={this.sendData} />
        </div>
        ;
        else if (this.state.stage === 3) {
            output = 
            <div className={formClasses.join(' ')}>
                <h1><span className="green">Готово!</span> Вот Ваш профиль:</h1>
                {this.state.fields.filter(field => field.valid && field.id)
                .map(field => {
                    return (<Input
                        key={field.type} 
                        label={field.label} 
                        hint={field.hint} 
                        type={field.type} 
                        value={field.value} 
                        onChange={(event) => this.inputHandler(event, field.label)}
                        valid={field.valid}
                        touched={field.touched}
                        options={field.options}
                        readonly />);
                })}
                {this.state.images.find(image => image.selected) ? <h6>Интересные изображения</h6> : null}
                <ImageGrid images={this.state.images.filter(image => image.selected)} readonly />
            </div>
            ;
        }

        if (this.state.loading)
        output = <Spinner />;
        if (this.state.error)
        output = <h1>{this.state.errorMessage}</h1>
        return output;
    };
}

export default Form;